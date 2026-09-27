using Microsoft.EntityFrameworkCore;

namespace ProductsBackend;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(e =>
        {
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.Description).HasMaxLength(1000);
            e.Property(p => p.Price).HasPrecision(18, 2);

            e.HasData(
                new Product { Id = 1, Name = "Ноутбук", Price = 79999.99m, Description = "Игровой ноутбук 16\" 32GB RAM" },
                new Product { Id = 2, Name = "Смартфон", Price = 45990.00m, Description = "Флагман с OLED-экраном" },
                new Product { Id = 3, Name = "Наушники", Price = 8990.50m, Description = "Беспроводные, с шумоподавлением" }
            );
        });
    }
}