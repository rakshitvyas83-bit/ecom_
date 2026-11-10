# Admin panel

## Order management setup

The order manager is available at `/admin/orders` and is linked from `/admin`.
Access requires the signed-in Appwrite user to have the `admin` label. The API
checks this label on every order list and status update request.

Before using it, add a `status` string column to the `orders` collection:

- Key: `status`
- Default: `placed`
- Required: no (new orders set it explicitly; existing orders may not have it)
- Size: at least 20 characters

The order status selector supports `placed`, `shipped`, and `delivered`. Add
an ascending index on `status` in Appwrite so the status filter query works.

Newly paid orders are saved with `status: "placed"`. The account order list
shows the current order status separately from payment status.
