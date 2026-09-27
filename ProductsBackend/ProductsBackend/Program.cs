using Microsoft.EntityFrameworkCore;
using ProductsBackend;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

var api = app.MapGroup("/api/products");

api.MapGet("/", async (AppDbContext db) =>
    Results.Ok(await db.Products.OrderBy(p => p.Id).ToListAsync()));

api.MapGet("/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});

api.MapPatch("/{id:int}", async (int id, ProductPatchDto dto, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    if (dto.Name is not null) product.Name = dto.Name;
    if (dto.Price is not null) product.Price = dto.Price.Value;
    if (dto.Description is not null) product.Description = dto.Description;

    await db.SaveChangesAsync();
    return Results.Ok(product);
});

api.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();