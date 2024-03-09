using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class BuyerIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuyerId",
                table: "Items");

            migrationBuilder.AddColumn<Guid[]>(
                name: "BuyerIds",
                table: "Items",
                type: "uuid[]",
                nullable: false,
                defaultValue: new Guid[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuyerIds",
                table: "Items");

            migrationBuilder.AddColumn<Guid>(
                name: "BuyerId",
                table: "Items",
                type: "uuid",
                nullable: true);
        }
    }
}
