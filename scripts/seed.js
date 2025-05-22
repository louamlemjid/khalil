const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/retail-system');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schema models
const PermissionSchema = new mongoose.Schema({
  nom: String,
  description: String,
});

const RoleSchema = new mongoose.Schema({
  nom: String,
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});

const UtilisateurSchema = new mongoose.Schema({
  nom: String,
  email: String,
  motDePasse: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  dateCreation: { type: Date, default: Date.now },
});

const CategorieSchema = new mongoose.Schema({
  nom: String,
  description: String,
});

const ProduitSchema = new mongoose.Schema({
  nom: String,
  description: String,
  prix: Number,
  categorie: String,
  image: String,
  dateCreation: { type: Date, default: Date.now },
});

const StockSchema = new mongoose.Schema({
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
  quantite: Number,
  seuilAlerte: Number,
  derniereMiseAJour: { type: Date, default: Date.now },
});

const ClientSchema = new mongoose.Schema({
  nom: String,
  email: String,
  telephone: String,
  adresse: String,
  dateCreation: { type: Date, default: Date.now },
});

// Register models
const Permission = mongoose.model('Permission', PermissionSchema);
const Role = mongoose.model('Role', RoleSchema);
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);
const Categorie = mongoose.model('Categorie', CategorieSchema);
const Produit = mongoose.model('Produit', ProduitSchema);
const Stock = mongoose.model('Stock', StockSchema);
const Client = mongoose.model('Client', ClientSchema);

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await Utilisateur.deleteMany({});
    await Categorie.deleteMany({});
    await Produit.deleteMany({});
    await Stock.deleteMany({});
    await Client.deleteMany({});
    
    console.log('Database cleared');
    
    // Create permissions
    const createPermission = await Permission.create({ nom: 'create', description: 'Create resources' });
    const readPermission = await Permission.create({ nom: 'read', description: 'Read resources' });
    const updatePermission = await Permission.create({ nom: 'update', description: 'Update resources' });
    const deletePermission = await Permission.create({ nom: 'delete', description: 'Delete resources' });
    
    // Create roles
    const adminRole = await Role.create({
      nom: 'admin',
      permissions: [createPermission._id, readPermission._id, updatePermission._id, deletePermission._id],
    });
    
    const vendeurRole = await Role.create({
      nom: 'vendeur',
      permissions: [readPermission._id, createPermission._id],
    });
    
    // Create users
    const adminPassword = await bcrypt.hash('password123', 10);
    const vendeurPassword = await bcrypt.hash('password123', 10);
    
    await Utilisateur.create({
      nom: 'Admin User',
      email: 'admin@example.com',
      motDePasse: adminPassword,
      role: adminRole._id,
    });
    
    await Utilisateur.create({
      nom: 'Vendeur User',
      email: 'vendeur@example.com',
      motDePasse: vendeurPassword,
      role: vendeurRole._id,
    });
    
    // Create categories
    const categories = [
      { nom: 'Électronique', description: 'Produits électroniques' },
      { nom: 'Vêtements', description: 'Vêtements et accessoires' },
      { nom: 'Alimentation', description: 'Produits alimentaires' },
      { nom: 'Maison', description: 'Articles pour la maison' },
    ];
    
    const createdCategories = await Categorie.insertMany(categories);
    
    // Create products
    const products = [
      {
        nom: 'Smartphone XYZ',
        description: 'Smartphone haut de gamme avec écran OLED',
        prix: 999.99,
        categorie: 'Électronique',
        image: 'https://example.com/phone.jpg',
      },
      {
        nom: 'Laptop Pro',
        description: 'Ordinateur portable puissant pour les professionnels',
        prix: 1499.99,
        categorie: 'Électronique',
        image: 'https://example.com/laptop.jpg',
      },
      {
        nom: 'T-shirt Classic',
        description: 'T-shirt en coton confortable',
        prix: 29.99,
        categorie: 'Vêtements',
        image: 'https://example.com/tshirt.jpg',
      },
      {
        nom: 'Jeans Slim',
        description: 'Jeans slim fit de qualité supérieure',
        prix: 79.99,
        categorie: 'Vêtements',
        image: 'https://example.com/jeans.jpg',
      },
      {
        nom: 'Café Premium',
        description: 'Café en grains de qualité supérieure',
        prix: 12.99,
        categorie: 'Alimentation',
        image: 'https://example.com/coffee.jpg',
      },
      {
        nom: 'Chaise Ergonomique',
        description: 'Chaise de bureau ergonomique',
        prix: 199.99,
        categorie: 'Maison',
        image: 'https://example.com/chair.jpg',
      },
    ];
    
    const createdProducts = await Produit.insertMany(products);
    
    // Create stock entries
    const stocks = createdProducts.map((product) => ({
      produit: product._id,
      quantite: Math.floor(Math.random() * 100) + 1,
      seuilAlerte: 10,
    }));
    
    await Stock.insertMany(stocks);
    
    // Create clients
    const clients = [
      {
        nom: 'John Doe',
        email: 'john@example.com',
        telephone: '123-456-7890',
        adresse: '123 Main St, City',
      },
      {
        nom: 'Jane Smith',
        email: 'jane@example.com',
        telephone: '987-654-3210',
        adresse: '456 Oak St, Town',
      },
      {
        nom: 'Bob Johnson',
        email: 'bob@example.com',
        telephone: '555-123-4567',
        adresse: '789 Pine St, Village',
      },
    ];
    
    await Client.insertMany(clients);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seed function
const run = async () => {
  await connectDB();
  await seedDatabase();
  mongoose.connection.close();
};

run();