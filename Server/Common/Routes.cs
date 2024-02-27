namespace Server.Common;

internal static class Routes
{
	public const string Wishlists = "api/wishlists";
	public const string WishlistItems = Wishlists + "/{wishlistId:guid}/items";
}
