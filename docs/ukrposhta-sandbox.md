# Ukrposhta sandbox integration

The provider lives in `lib/ukrposhta/sandbox.ts`, which is marked `server-only`. It uses only `https://dev.ukrposhta.ua/ecom/0.0.1/`; no production Ukrposhta request is made by this integration.

## Configuration

Set these only in the local environment and in the Vercel environment-variable settings. Never use the `NEXT_PUBLIC_` prefix and never commit their values:

- `UKRPOSHTA_SANDBOX_BEARER`
- `UKRPOSHTA_COUNTERPARTY_TOKEN`
- `UKRPOSHTA_COUNTERPARTY_UUID`
- `UKRPOSHTA_APP_LOGIN`
- `UKRPOSHTA_APP_PASSWORD`

The official e-commerce flow uses the bearer, counterparty token and counterparty UUID for address, recipient and shipment requests. Login and password are retained as requested configuration for a future official endpoint, but are deliberately not sent to an undocumented endpoint.

## Checkout boundary

The current Marketplace is an affiliate catalogue: it sends the buyer to a partner and has no cart, order record, payment confirmation, or authenticated checkout. Consequently it must not create a Ukrposhta shipment. The `UkrposhtaSandboxClient` is the service to call from a future server-side, authenticated order-confirmation transaction:

1. validate recipient and delivery draft;
2. create the recipient address and recipient;
3. persist the Marketplace order and the returned recipient UUID in one controlled workflow;
4. after confirmed payment, call `createShipment` once with the selected delivery type and parcel data;
5. store only the returned tracking number and delivery price in the order record.

Do not expose `createShipment` through a public route: it has external side effects and requires authenticated order ownership plus idempotency protection.

## Delivery and tracking

The checkout data model supports a branch (`postOfficeId`) or courier address (street and house number), along with oblast, settlement and postcode. Ukrposhta's published office directory is not documented as a sandbox e-commerce endpoint, so the sandbox implementation does not substitute static offices or call the production directory.

Ukrposhta's published tracking host is production-only. `UkrposhtaSandboxTrackingAdapter` is intentionally a no-network adapter until Ukrposhta supplies a sandbox tracking endpoint. It prevents accidental production traffic while preserving the future order-status interface.

## Safe checks

- `GET /api/shipping/ukrposhta` shows configuration state and missing variable names only.
- `POST /api/shipping/ukrposhta` accepts a recipient and delivery draft and returns validation errors only; it never contacts Ukrposhta.
- A real sandbox shipment may be tested manually through the server-side client only after valid sandbox credentials and an authenticated, idempotent order workflow exist.
