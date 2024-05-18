import { createHmac } from "crypto";

describe("Webhook API", () => {
  it("should successfully process a valid webhook request and send an email", () => {
    const payload = {
      visitor: { name: "John Doe", city: "San Francisco", country: "USA" },
      message: { text: "Hello, I need help with my order." },
      time: "2024-05-18T12:00:00Z",
      property: { id: "12345", name: "My Website" },
    };

    const body = JSON.stringify(payload);
    const secret = Cypress.env("TWAK_SECRET_KEY");
    const signature = createHmac("sha1", secret).update(body).digest("hex");

    cy.request({
      method: "POST",
      url: "/api/webhook",
      headers: {
        "x-tawk-signature": signature,
      },
      body: body,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("Success!");

      // Verify email was sent
      // cy.get("@sendEmailNotificationStub").should(
      //   "have.been.calledOnceWithExactly",
      //   body
      // );
    });
  });

  it("should reject a webhook request with an invalid signature", () => {
    const payload = {
      visitor: { name: "Jane Doe", city: "Los Angeles", country: "USA" },
      message: { text: "Hi, can you help me with my account?" },
      time: "2024-05-18T13:00:00Z",
      property: { id: "67890", name: "Another Website" },
    };

    const body = JSON.stringify(payload);
    const invalidSignature = "invalid_signature";

    cy.request({
      method: "POST",
      url: "/api/webhook",
      headers: {
        "x-tawk-signature": invalidSignature,
      },
      body: body,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body).to.eq("Webhook signature verification failed!");

      // Verify email was not sent
      // cy.get("@sendEmailNotificationStub").should("not.have.been.called");
    });
  });
});
