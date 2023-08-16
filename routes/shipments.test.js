"use strict";
const shipItApi = require("../shipItApi"); //{ shipItApi: "func"}
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");



describe("POST /", function () {
  test("valid", async function () {

    shipItApi.shipProduct.mockReturnValue(7);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 7 });
  });


  test("throws error if no request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": "Bad Request",
        "status": 400
      }
    });
  });


  test("throws error if empty body", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({});
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance requires property \"productId\"",
          "instance requires property \"name\"",
          "instance requires property \"addr\"",
          "instance requires property \"zip\""
        ],
        "status": 400
      }
    });
  });



  test("invalid error messages", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({
        "productId": 899,
        "name": 10,
        "zip": "1234789000000000"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId must be greater than or equal to 1000",
          "instance.name is not of a type(s) string",
          "instance.zip does not meet maximum length of 10",
          "instance requires property \"addr\""
        ],
        "status": 400
      }
    });
  });


  test("wrong input types", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({
        "productId": "bob",
        "name": 10,
        "zip": 10000000,
        "addr": 100
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId is not of a type(s) integer",
          "instance.name is not of a type(s) string",
          "instance.addr is not of a type(s) string",
          "instance.zip is not of a type(s) string"
        ],
        "status": 400
      }
    });
  });
  //TODO: test no product Id, no product name, no zipcode, no address
  //TODO: test if product Id is under 1000, should be invalid
  //TODO: test if zipcode is too short or too long (two separate tests)
  //TODO: test if we sent the wrong types

  test("invalid zip code, too long", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({
        "productId": 1000,
        "name": "Test Tester",
        "addr": "100 Test St",
        "zip": "12345-6789123213213123"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.zip does not meet maximum length of 10"
        ],
        "status": 400
      }
    });
  });


  test("invalid zip code, too short", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({
        "productId": 1000,
        "name": "Test Tester",
        "addr": "100 Test St",
        "zip": "12"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.zip does not meet minimum length of 5"
        ],
        "status": 400
      }
    });
  });



  test("item Id has to be at least 1000", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({
        "productId": 999,
        "name": "Test Tester",
        "addr": "100 Test St",
        "zip": "12345-6789"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId must be greater than or equal to 1000"
        ],
        "status": 400
      }
    });
  });


  test("no additional properties are sent", async function () {
    const resp = await request(app)
      .post('/shipments')
      .send({
        "productId": 1000,
        "name": "Test Tester",
        "addr": "100 Test St",
        "zip": "12345-6789",
        "phone": 1234567
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance is not allowed to have the additional property \"phone\""
        ],
        "status": 400
      }
    });
  });






});
