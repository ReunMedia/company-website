import { beforeEach, describe, it } from "vitest";
import { Client, fetchExchange, gql } from "@urql/core";

describe("Contact Form submission", async () => {
  const defaultInput = {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "Hello Reun!",
    acceptPrivacy: true,
  };

  const mutation = gql(`
    mutation submitContactFormTest($input: create_contactFormResponses_input!) {
      create_contactFormResponses_item(data: $input)
    }
  `);

  interface Ctx {
    client: Client;
  }

  beforeEach<Ctx>((ctx) => {
    ctx.client = new Client({
      url: "http://localhost:8055/graphql",
      exchanges: [fetchExchange],
    });
  });

  it<Ctx>("should create a new form response", async ({ expect, client }) => {
    const input = {
      ...defaultInput,
    };
    const { data, error } = await client.mutation(mutation, { input: input });
    expect(error).toBeFalsy();
    expect(data?.create_contactFormResponses_item).toBeTruthy();
  });

  it<Ctx>("should not allow setting submission ID", async ({
    expect,
    client,
  }) => {
    const input = {
      id: 128,
      ...defaultInput,
    };
    const { data, error } = await client.mutation(mutation, { input: input });
    const msg =
      "To fix this error, disable public 'ID' field create permission";
    expect(error, msg).toBeTruthy();
    expect(data?.create_contactFormResponses_item, msg).toBeUndefined();
  });

  it<Ctx>("should not allow setting submission creation date", async ({
    expect,
    client,
  }) => {
    const input = {
      date_created: "2023-10-10T12:39:42Z",
      ...defaultInput,
    };
    const { data, error } = await client.mutation(mutation, { input: input });
    const msg =
      "To fix this error, disable public 'date_created' field create permission";
    expect(error, msg).toBeTruthy();
    expect(data?.create_contactFormResponses_item, msg).toBeUndefined();
  });

  it<Ctx>("must require privacy policy to be accepted", async ({
    expect,
    client,
  }) => {
    const input = {
      ...defaultInput,
      acceprPrivacy: false,
    };
    const { data, error } = await client.mutation(mutation, { input: input });
    const msg =
      "To fix this error, add field validation for 'acceptPrivacy' field";
    expect(error, msg).toBeTruthy();
    expect(data?.create_contactFormResponses_item, msg).toBeUndefined();
  });
});
