import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  ShoppingCart, Package, CreditCard, Check, Plus, Minus,
  Edit2, Save, X, Users, FileText, Tag, BarChart3, Scale,
  Trash2, Search, ArrowLeft, ArrowRight, Printer, Download,
  AlertCircle, RefreshCw, TrendingUp, Star
} from 'lucide-react';

const FimmaSaleSimulation = () => {
  // États principaux
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('ventes');
  const [searchTerm, setSearchTerm] = useState('');
  const [saleCompleted, setSaleCompleted] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Références pour les champs de formulaire
  const searchInputRef = useRef(null);

  // États pour les formulaires
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showUniteForm, setShowUniteForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Données initiales - PRODUITS TISSU AVEC SOUS-UNITÉS
  const [unites, setUnites] = useState([
    { id: 1, nom: 'Pièce', abreviation: 'pc', description: 'Unité individuelle' },
    { id: 2, nom: 'Mètre', abreviation: 'm', description: 'Mètre linéaire' },
    { id: 3, nom: 'Demi-mètre', abreviation: '½m', description: 'Demi mètre' },
    { id: 4, nom: 'Rouleau', abreviation: 'rl', description: 'Rouleau complet' },
    { id: 5, nom: 'Lot', abreviation: 'lot', description: 'Lot de pièces' },
    { id: 6, nom: 'Carton', abreviation: 'ctn', description: 'Carton de 12 pièces' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, nom: 'Tissu Wax', description: 'Tissus wax africains', site_id: 1 },
    { id: 2, nom: 'Tissu Bazin', description: 'Tissus bazin riche', site_id: 1 },
    { id: 3, nom: 'Tissu Léger', description: 'Voile, crêpe, mousseline', site_id: 1 },
    { id: 4, nom: 'Tissu Jean', description: 'Denim et jean', site_id: 1 },
    { id: 5, nom: 'Tissu Pagne', description: 'Pagnes traditionnels', site_id: 1 }
  ]);

  const [clients, setClients] = useState([
    {
      id: 1,
      nom_complet: 'Aïssatou Diallo',
      email: 'aissatou.diallo@mail.gn',
      telephone: '+224 635 12 34 56',
      adresse: 'Lambanyi, Conakry',
      commercant_id: 1,
      actif: true
    },
    {
      id: 2,
      nom_complet: 'Sadou Diallo',
      email: 'sadou.diallo@mail.gn',
      telephone: '+224 635 12 34 56',
      adresse: 'Petit Paris, Conakry',
      commercant_id: 1,
      actif: true
    },
  ]);

  const [products, setProducts] = useState([
    // Tissu Wax
    {
      id: 1,
      nom_produit: 'Wax Africain Premium',
      reference: 'WAX-PREM',
      description: 'Tissu wax de haute qualité, motifs traditionnels',
      prix_vente: 12000,
      prix_achat: 8000,
      stock_initial: 200,
      stock_minimum: 20,
      tva: 18,
      categorie_id: 1,
      commercant_id: 1,
      actif: true,
      disponible_ecommerce: true,
      unite_base_id: 2,
      produit_unites: [
        { id: 1, produit_id: 1, unite_id: 2, coefficient_vers_unite_base: 1, prix_par_unite: 12000, est_unite_base: true },
        { id: 2, produit_id: 1, unite_id: 3, coefficient_vers_unite_base: 0.5, prix_par_unite: 6500, est_unite_base: false },
        { id: 3, produit_id: 1, unite_id: 4, coefficient_vers_unite_base: 6, prix_par_unite: 65000, est_unite_base: false }
      ],
      stocks: [{ site_id: 1, quantite: 200, stock_disponible: 200 }]
    },
    // Tissu Bazin
    {
      id: 2,
      nom_produit: 'Bazin Riche Brodé',
      reference: 'BAZIN-BRD',
      description: 'Bazin de qualité supérieure avec broderies',
      prix_vente: 25000,
      prix_achat: 15000,
      stock_initial: 100,
      stock_minimum: 10,
      tva: 18,
      categorie_id: 2,
      commercant_id: 1,
      actif: true,
      disponible_ecommerce: true,
      unite_base_id: 2,
      produit_unites: [
        { id: 4, produit_id: 2, unite_id: 2, coefficient_vers_unite_base: 1, prix_par_unite: 25000, est_unite_base: true },
        { id: 5, produit_id: 2, unite_id: 3, coefficient_vers_unite_base: 0.5, prix_par_unite: 13000, est_unite_base: false },
        { id: 6, produit_id: 2, unite_id: 4, coefficient_vers_unite_base: 5, prix_par_unite: 115000, est_unite_base: false }
      ],
      stocks: [{ site_id: 1, quantite: 100, stock_disponible: 100 }]
    },
    // Tissu Voile
    {
      id: 3,
      nom_produit: 'Voile Transparent',
      reference: 'VOILE-TSP',
      description: 'Voile léger pour rideaux et vêtements',
      prix_vente: 5000,
      prix_achat: 3000,
      stock_initial: 150,
      stock_minimum: 15,
      tva: 18,
      categorie_id: 3,
      commercant_id: 1,
      actif: true,
      disponible_ecommerce: true,
      unite_base_id: 2,
      produit_unites: [
        { id: 7, produit_id: 3, unite_id: 2, coefficient_vers_unite_base: 1, prix_par_unite: 5000, est_unite_base: true },
        { id: 8, produit_id: 3, unite_id: 3, coefficient_vers_unite_base: 0.5, prix_par_unite: 2800, est_unite_base: false },
        { id: 9, produit_id: 3, unite_id: 4, coefficient_vers_unite_base: 20, prix_par_unite: 90000, est_unite_base: false }
      ],
      stocks: [{ site_id: 1, quantite: 150, stock_disponible: 150 }]
    },
    // Tissu Jean
    {
      id: 4,
      nom_produit: 'Jean Denim Bleu',
      reference: 'JEAN-DNM',
      description: 'Jean denim de qualité pour vêtements',
      prix_vente: 15000,
      prix_achat: 9000,
      stock_initial: 80,
      stock_minimum: 8,
      tva: 18,
      categorie_id: 4,
      commercant_id: 1,
      actif: true,
      disponible_ecommerce: true,
      unite_base_id: 2,
      produit_unites: [
        { id: 10, produit_id: 4, unite_id: 2, coefficient_vers_unite_base: 1, prix_par_unite: 15000, est_unite_base: true },
        { id: 11, produit_id: 4, unite_id: 3, coefficient_vers_unite_base: 0.5, prix_par_unite: 8000, est_unite_base: false },
        { id: 12, produit_id: 4, unite_id: 4, coefficient_vers_unite_base: 3, prix_par_unite: 42000, est_unite_base: false }
      ],
      stocks: [{ site_id: 1, quantite: 80, stock_disponible: 80 }]
    },
    // Pagne Traditionnel
    {
      id: 5,
      nom_produit: 'Pagne Traditionnel',
      reference: 'PAGNE-TRD',
      description: 'Pagne en tissu traditionnel africain',
      prix_vente: 8000,
      prix_achat: 5000,
      stock_initial: 120,
      stock_minimum: 12,
      tva: 18,
      categorie_id: 5,
      commercant_id: 1,
      actif: true,
      disponible_ecommerce: true,
      unite_base_id: 1,
      produit_unites: [
        { id: 13, produit_id: 5, unite_id: 1, coefficient_vers_unite_base: 1, prix_par_unite: 8000, est_unite_base: true },
        { id: 14, produit_id: 5, unite_id: 5, coefficient_vers_unite_base: 3, prix_par_unite: 22000, est_unite_base: false },
        { id: 15, produit_id: 5, unite_id: 6, coefficient_vers_unite_base: 12, prix_par_unite: 85000, est_unite_base: false }
      ],
      stocks: [{ site_id: 1, quantite: 120, stock_disponible: 120 }]
    },
    // Tissu Brocart
    {
      id: 6,
      nom_produit: 'Brocart Doré',
      reference: 'BROCART-OR',
      description: 'Tissu brocart pour occasions spéciales',
      prix_vente: 18000,
      prix_achat: 11000,
      stock_initial: 60,
      stock_minimum: 6,
      tva: 18,
      categorie_id: 2,
      commercant_id: 1,
      actif: true,
      disponible_ecommerce: true,
      unite_base_id: 2,
      produit_unites: [
        { id: 16, produit_id: 6, unite_id: 2, coefficient_vers_unite_base: 1, prix_par_unite: 18000, est_unite_base: true },
        { id: 17, produit_id: 6, unite_id: 3, coefficient_vers_unite_base: 0.5, prix_par_unite: 9500, est_unite_base: false },
        { id: 18, produit_id: 6, unite_id: 4, coefficient_vers_unite_base: 4, prix_par_unite: 68000, est_unite_base: false }
      ],
      stocks: [{ site_id: 1, quantite: 60, stock_disponible: 60 }]
    }
  ]);

  const [ventes, setVentes] = useState([]);
  const [factures, setFactures] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [payment, setPayment] = useState({
    moyen: 'cash',
    montant: 0,
    transaction_id: '',
    statut: 'recu'
  });

  const [newCategory, setNewCategory] = useState({ nom: '', description: '' });
  const [newUnite, setNewUnite] = useState({ nom: '', abreviation: '', description: '' });
  const [newClient, setNewClient] = useState({
    nom_complet: '', email: '', telephone: '', adresse: ''
  });

  const [newProduct, setNewProduct] = useState({
    nom_produit: '',
    reference: '',
    description: '',
    prix_vente: 0,
    prix_achat: 0,
    stock_initial: 100,
    stock_minimum: 0,
    tva: 18,
    categorie_id: '',
    unite_base_id: '',
    actif: true,
    disponible_ecommerce: true,
    produit_unites: []
  });

  // 🔥 FONCTIONS UTILITAIRES
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 600);
  }, []);

  const getUniteById = useCallback((id) => unites.find(u => u.id === id), [unites]);
  const getCategorieById = useCallback((id) => categories.find(c => c.id === id), [categories]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const calculateCartTotals = useCallback(() => {
    let total_ht = 0;
    let total_tva = 0;

    cart.forEach(item => {
      const montant_ht = item.prix_unitaire * item.quantite;
      const tva_montant = montant_ht * (item.tva / 100);
      total_ht += montant_ht;
      total_tva += tva_montant;
    });

    return {
      total_ht: Math.round(total_ht * 100) / 100,
      total_tva: Math.round(total_tva * 100) / 100,
      total_ttc: Math.round((total_ht + total_tva) * 100) / 100
    };
  }, [cart]);

  const totals = useMemo(() => calculateCartTotals(), [calculateCartTotals]);

  // 🔥 FONCTIONS DE GESTION
  const addToCart = useCallback((product, produitUnite) => {
    try {
      setCart(currentCart => {
        const unite = getUniteById(produitUnite.unite_id);
        const stockDisponible = product.stocks?.[0]?.stock_disponible || 0;
        const quantiteEnBase = 1 * (produitUnite.coefficient_vers_unite_base || 1);

        if (quantiteEnBase > stockDisponible) {
          showNotification(
            `Stock insuffisant! Stock disponible: ${stockDisponible} ${getUniteById(product.unite_base_id)?.abreviation || 'unités'}`,
            'warning'
          );
          return currentCart;
        }

        const existingItem = currentCart.find(item =>
          item.product_id === product.id && item.produit_unite_id === produitUnite.id
        );

        if (existingItem) {
          const newQuantite = existingItem.quantite + 1;
          const newQuantiteEnBase = newQuantite * (produitUnite.coefficient_vers_unite_base || 1);

          if (newQuantiteEnBase > stockDisponible) {
            const maxQuantite = Math.floor(stockDisponible / (produitUnite.coefficient_vers_unite_base || 1));
            showNotification(
              `Stock insuffisant! Quantité maximale: ${maxQuantite} ${unite?.abreviation || 'unités'}`,
              'warning'
            );
            return currentCart;
          }

          showNotification(`${product.nom_produit} - Quantité augmentée`, 'success');
          return currentCart.map(item =>
            item.product_id === product.id && item.produit_unite_id === produitUnite.id
              ? { ...item, quantite: newQuantite }
              : item
          );
        } else {
          showNotification(`${product.nom_produit} ajouté au panier`, 'success');
          return [...currentCart, {
            id: Date.now(),
            product_id: product.id,
            produit_unite_id: produitUnite.id,
            nom_produit: product.nom_produit,
            quantite: 1,
            prix_unitaire: produitUnite.prix_par_unite || 0,
            tva: product.tva || 0,
            unite_nom: unite?.nom || 'Unité',
            unite_abreviation: unite?.abreviation || 'unité',
            coefficient: produitUnite.coefficient_vers_unite_base || 1
          }];
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      showNotification('Erreur lors de l\'ajout au panier', 'error');
    }
  }, [getUniteById, showNotification]);

  const updateQuantity = useCallback((itemId, delta) => {
    setCart(currentCart =>
      currentCart.map(item => {
        if (item.id === itemId) {
          const newQuantite = Math.max(1, item.quantite + delta);
          const product = products.find(p => p.id === item.product_id);
          const stockDisponible = product?.stocks?.[0]?.stock_disponible || 0;
          const quantiteEnBase = newQuantite * (item.coefficient || 1);

          if (quantiteEnBase > stockDisponible) {
            const maxQuantite = Math.floor(stockDisponible / (item.coefficient || 1));
            showNotification(`Stock insuffisant! Quantité maximale: ${maxQuantite} ${item.unite_abreviation}`, 'warning');
            return item;
          }

          return { ...item, quantite: newQuantite };
        }
        return item;
      }).filter(item => item.quantite > 0)
    );
  }, [products, showNotification]);

  const removeFromCart = useCallback((itemId) => {
    setCart(currentCart => {
      const item = currentCart.find(i => i.id === itemId);
      if (item) {
        showNotification(`${item.nom_produit} retiré du panier`, 'info');
      }
      return currentCart.filter(item => item.id !== itemId);
    });
  }, [showNotification]);

  // Gestion des unités
  const addUnite = useCallback(() => {
    if (!newUnite.nom.trim() || !newUnite.abreviation.trim()) {
      showNotification('Le nom et l\'abréviation sont obligatoires', 'warning');
      return;
    }

    const unite = {
      id: Math.max(0, ...unites.map(u => u.id)) + 1,
      ...newUnite
    };

    setUnites([...unites, unite]);
    setNewUnite({ nom: '', abreviation: '', description: '' });
    setShowUniteForm(false);
    showNotification('Unité créée avec succès', 'success');
  }, [newUnite, unites, showNotification]);

  // Gestion des catégories
  const addCategory = useCallback(() => {
    if (!newCategory.nom.trim()) {
      showNotification('Le nom de la catégorie est obligatoire', 'warning');
      return;
    }

    const category = {
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      ...newCategory,
      site_id: 1
    };

    setCategories([...categories, category]);
    setNewCategory({ nom: '', description: '' });
    setShowCategoryForm(false);
    showNotification('Catégorie créée avec succès', 'success');
  }, [newCategory, categories, showNotification]);

  // Gestion des produits
  const addProduitUnite = useCallback(() => {
    setNewProduct(prev => ({
      ...prev,
      produit_unites: [...prev.produit_unites, {
        id: Date.now(),
        unite_id: '',
        coefficient_vers_unite_base: 1,
        prix_par_unite: 0,
        est_unite_base: false
      }]
    }));
  }, []);

  const updateProduitUnite = useCallback((index, field, value) => {
    setNewProduct(prev => {
      const updated = [...prev.produit_unites];
      updated[index] = { ...updated[index], [field]: value };

      if (field === 'est_unite_base' && value === true) {
        return {
          ...prev,
          prix_vente: updated[index].prix_par_unite,
          unite_base_id: updated[index].unite_id,
          produit_unites: updated
        };
      } else {
        return { ...prev, produit_unites: updated };
      }
    });
  }, []);

  const removeProduitUnite = useCallback((index) => {
    setNewProduct(prev => ({
      ...prev,
      produit_unites: prev.produit_unites.filter((_, i) => i !== index)
    }));
  }, []);

  const saveProduct = useCallback(() => {
    if (!newProduct.nom_produit.trim() || !newProduct.reference.trim()) {
      showNotification('Le nom et la référence sont obligatoires', 'warning');
      return;
    }

    if (!newProduct.unite_base_id) {
      showNotification('Veuillez sélectionner une unité de base', 'warning');
      return;
    }

    let produit_unites = [...newProduct.produit_unites];

    const hasUniteBase = produit_unites.some(pu =>
      pu.est_unite_base && pu.unite_id === newProduct.unite_base_id
    );

    if (!hasUniteBase) {
      produit_unites.push({
        id: Date.now(),
        unite_id: newProduct.unite_base_id,
        coefficient_vers_unite_base: 1,
        prix_par_unite: newProduct.prix_vente,
        est_unite_base: true
      });
    }

    const productData = {
      ...newProduct,
      produit_unites,
      stocks: [{
        site_id: 1,
        quantite: newProduct.stock_initial,
        quantite_reservee: 0,
        quantite_bloquee: 0,
        stock_disponible: newProduct.stock_initial
      }]
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
      showNotification('Produit modifié avec succès', 'success');
    } else {
      setProducts([...products, { ...productData, id: Math.max(0, ...products.map(p => p.id)) + 1 }]);
      showNotification('Produit créé avec succès', 'success');
    }

    resetProductForm();
  }, [newProduct, editingProduct, products, showNotification]);

  const resetProductForm = useCallback(() => {
    setNewProduct({
      nom_produit: '',
      reference: '',
      description: '',
      prix_vente: 0,
      prix_achat: 0,
      stock_initial: 100,
      stock_minimum: 0,
      tva: 18,
      categorie_id: '',
      unite_base_id: '',
      actif: true,
      disponible_ecommerce: true,
      produit_unites: []
    });
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  // Gestion des clients
  const addClient = useCallback(() => {
    if (!newClient.nom_complet.trim()) {
      showNotification('Le nom complet est obligatoire', 'warning');
      return;
    }

    const client = {
      id: Math.max(0, ...clients.map(c => c.id)) + 1,
      ...newClient,
      commercant_id: 1,
      actif: true
    };

    setClients([...clients, client]);
    setNewClient({ nom_complet: '', email: '', telephone: '', adresse: '' });
    setShowClientForm(false);
    showNotification('Client créé avec succès', 'success');
  }, [newClient, clients, showNotification]);

  // Finaliser la vente
  const finalizeSale = useCallback(() => {
    if (cart.length === 0) {
      showNotification('Le panier est vide', 'warning');
      return;
    }

    if (!selectedClient) {
      showNotification('Veuillez sélectionner un client', 'warning');
      return;
    }

    const totals = calculateCartTotals();

    // Créer la vente
    const nouvelleVente = {
      id: ventes.length + 1,
      date_vente: new Date().toISOString(),
      total_ht: totals.total_ht,
      total_tva: totals.total_tva,
      montant_total: totals.total_ttc,
      nom_client: selectedClient.nom_complet,
      client_fidele_id: selectedClient.id,
      utilisateur_id: 1,
      site_id: 1,
      devise_id: 1,
      details: [...cart]
    };

    // Créer le paiement
    const nouveauPaiement = {
      id: paiements.length + 1,
      vente_id: nouvelleVente.id,
      montant: totals.total_ttc,
      moyen: payment.moyen,
      statut: payment.statut,
      transaction_id: payment.transaction_id,
      date: new Date().toISOString(),
      devise_id: 1
    };

    // Créer la facture
    const nouvelleFacture = {
      id: factures.length + 1,
      vente_id: nouvelleVente.id,
      client_id: selectedClient.id,
      site_id: 1,
      total_ht: totals.total_ht,
      total_tva: totals.total_tva,
      total: totals.total_ttc,
      statut: 'generee',
      date_emission: new Date().toISOString(),
      details: [...cart]
    };

    // Mettre à jour les stocks
    const updatedProducts = products.map(product => {
      const cartItems = cart.filter(item => item.product_id === product.id);
      if (cartItems.length > 0) {
        let stockReduction = 0;
        cartItems.forEach(item => {
          stockReduction += item.quantite * (item.coefficient || 1);
        });

        const stock = product.stocks[0];
        return {
          ...product,
          stocks: [{
            ...stock,
            quantite: stock.quantite - stockReduction,
            stock_disponible: stock.stock_disponible - stockReduction
          }]
        };
      }
      return product;
    });

    // Mettre à jour tous les états
    setVentes([...ventes, nouvelleVente]);
    setPaiements([...paiements, nouveauPaiement]);
    setFactures([...factures, nouvelleFacture]);
    setProducts(updatedProducts);
    setCurrentInvoice(nouvelleFacture);
    setSaleCompleted(true);

    showNotification(
      `Vente enregistrée! Facture #${nouvelleFacture.id} - ${totals.total_ttc.toLocaleString()} FG`,
      'success'
    );
  }, [cart, selectedClient, calculateCartTotals, ventes, paiements, factures, products, payment, showNotification]);

  // Nouvelle vente
  const startNewSale = useCallback(() => {
    setCart([]);
    setSelectedClient(null);
    setPayment({ moyen: 'cash', montant: 0, transaction_id: '', statut: 'recu' });
    setCurrentStep(1);
    setSaleCompleted(false);
    setCurrentInvoice(null);
    showNotification('Nouvelle vente démarrée', 'info');
  }, [showNotification]);

  // Réinitialiser toutes les données
  const resetAllData = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
      window.location.reload();
    }
  }, []);

  // Imprimer la facture
  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  // 🔥 COMPOSANTS MÉMOÏSÉS
  const NotificationCenter = useMemo(() => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
            'bg-blue-50 border-blue-500 text-blue-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <Check size={20} />}
            {notification.type === 'warning' && <AlertCircle size={20} />}
            {notification.type === 'error' && <X size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      ))}
    </div>
  ), [notifications]);

  const SearchBar = useMemo(() => (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  ), [searchTerm, handleSearchChange]);

  const CartDisplay = useMemo(() => {
    if (cart.length === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-3">Panier actuel ({cart.length} articles)</h4>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">{item.nom_produit}</p>
              <p className="text-sm text-gray-600">
                {item.quantite} × {item.prix_unitaire.toLocaleString()} FG ({item.unite_abreviation})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-8 text-center">{item.quantite}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800 transition-colors ml-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total TTC:</span>
            <span className="text-indigo-600">{totals.total_ttc.toLocaleString()} FG</span>
          </div>
        </div>
      </div>
    );
  }, [cart, totals, updateQuantity, removeFromCart]);

  const Step1Products = useMemo(() => {
    const filteredProducts = products.filter(product =>
      product.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="text-indigo-600" size={32} />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Sélection des Produits</h3>
                <p className="text-gray-600">Ajoutez des produits au panier</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Stock total</p>
              <p className="text-lg font-bold text-indigo-600">
                {products.reduce((sum, p) => sum + (p.stocks?.[0]?.stock_disponible || 0), 0)} unités
              </p>
            </div>
          </div>

          {SearchBar}

          <div className="grid gap-4 mb-6">
            {filteredProducts.map(product => {
              const category = getCategorieById(product.categorie_id);
              const stock = product.stocks?.[0];
              const uniteBase = getUniteById(product.unite_base_id);

              return (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{product.nom_produit}</h4>
                        {category && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {category.nom}
                          </span>
                        )}
                        {stock?.stock_disponible <= product.stock_minimum && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Stock faible
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                      <p className="text-sm text-gray-600">
                        Réf: {product.reference} | Stock: {stock?.stock_disponible || 0} {uniteBase?.abreviation}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.produit_unites?.map(pu => {
                      const unite = getUniteById(pu.unite_id);
                      const quantiteEnBase = 1 * (pu.coefficient_vers_unite_base || 1);
                      const isAvailable = quantiteEnBase <= (stock?.stock_disponible || 0);

                      // CORRECTION : Garantir l'affichage de l'abréviation
                      const uniteAbreviation = unite?.abreviation || 'unité';

                      return (
                        <button
                          key={pu.id}
                          onClick={() => addToCart(product, pu)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pu.est_unite_base
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                          title={!isAvailable ? 'Stock insuffisant' : `Ajouter en ${uniteAbreviation}`}
                        >
                          {uniteAbreviation} - {pu.prix_par_unite.toLocaleString()} FG
                          {pu.coefficient_vers_unite_base !== 1 && 
                            ` (×${pu.coefficient_vers_unite_base})`
                          }
                          {pu.est_unite_base && ' ⭐'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {CartDisplay}

          <button
            onClick={() => setCurrentStep(2)}
            disabled={cart.length === 0}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight size={20} />
            Suivant: Sélection du Client
          </button>
        </div>
      </div>
    );
  }, [searchTerm, products, SearchBar, CartDisplay, addToCart, getCategorieById, getUniteById, cart]);

  const Step2Client = useMemo(() => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-indigo-600" size={32} />
            <h3 className="text-xl font-bold text-gray-800">Sélection du Client</h3>
          </div>
          <button
            onClick={() => setShowClientForm(!showClientForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <Plus size={20} /> Nouveau Client
          </button>
        </div>

        {showClientForm && (
          <div className="bg-gray-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Nouveau Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="client-nom" className="block text-sm font-medium mb-1">Nom complet *</label>
                <input
                  id="client-nom"
                  name="client-nom"
                  type="text"
                  value={newClient.nom_complet}
                  onChange={(e) => setNewClient({ ...newClient, nom_complet: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label htmlFor="client-email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="client-email"
                  name="client-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label htmlFor="client-telephone" className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  id="client-telephone"
                  name="client-telephone"
                  type="tel"
                  value={newClient.telephone}
                  onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+224 XXX XX XX XX"
                />
              </div>
              <div>
                <label htmlFor="client-adresse" className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  id="client-adresse"
                  name="client-adresse"
                  type="text"
                  value={newClient.adresse}
                  onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Adresse complète"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addClient}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Créer le client
              </button>
              <button
                onClick={() => setShowClientForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3">Récapitulatif du panier</h4>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{item.nom_produit}</p>
                <p className="text-sm text-gray-600">
                  {item.quantite} {item.unite_abreviation} × {item.prix_unitaire.toLocaleString()} FG
                </p>
              </div>
              <span className="font-semibold">
                {(item.prix_unitaire * item.quantite).toLocaleString()} FG
              </span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-lg font-bold text-indigo-600">
              <span>Total TTC:</span>
              <span>{totals.total_ttc.toLocaleString()} FG</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 mb-6">
          {clients.filter(c => c.actif).map(client => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedClient?.id === client.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'hover:border-gray-400'
              }`}
            >
              <h4 className="font-semibold">{client.nom_complet}</h4>
              <p className="text-sm text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-600">{client.telephone}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour aux produits
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            disabled={!selectedClient}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight size={20} />
            Suivant: Paiement
          </button>
        </div>
      </div>
    </div>
  ), [showClientForm, newClient, cart, totals, clients, selectedClient, addClient]);

  const Step3Payment = useMemo(() => {
    if (saleCompleted && currentInvoice) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="text-green-600" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Facture Générée</h3>
                  <p className="text-gray-600">Vente finalisée avec succès</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={printInvoice}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Printer size={20} /> Imprimer
                </button>
                <button
                  onClick={startNewSale}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} /> Nouvelle Vente
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">FACTURE</h2>
                <p className="text-gray-600">N° {currentInvoice.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Informations du Client</h3>
                  <p><strong>Nom:</strong> {selectedClient?.nom_complet}</p>
                  <p><strong>Email:</strong> {selectedClient?.email}</p>
                  <p><strong>Téléphone:</strong> {selectedClient?.telephone}</p>
                  <p><strong>Adresse:</strong> {selectedClient?.adresse}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Informations de la Facture</h3>
                  <p><strong>Date:</strong> {new Date(currentInvoice.date_emission).toLocaleDateString()}</p>
                  <p><strong>Référence:</strong> {currentInvoice.id}</p>
                  <p><strong>Statut:</strong> <span className="text-green-600">{currentInvoice.statut}</span></p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Détails des Articles</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Produit</th>
                        <th className="px-4 py-2 text-center">Quantité</th>
                        <th className="px-4 py-2 text-right">Prix Unitaire</th>
                        <th className="px-4 py-2 text-right">TVA</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInvoice.details.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{item.nom_produit}</p>
                              <p className="text-sm text-gray-600">{item.unite_abreviation}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantite}</td>
                          <td className="px-4 py-3 text-right">{item.prix_unitaire.toLocaleString()} FG</td>
                          <td className="px-4 py-3 text-right">{item.tva}%</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {(item.prix_unitaire * item.quantite).toLocaleString()} FG
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total HT:</span>
                  <span className="font-semibold">{currentInvoice.total_ht.toLocaleString()} FG</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total TVA:</span>
                  <span className="font-semibold">{currentInvoice.total_tva.toLocaleString()} FG</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-2">
                  <span>Total TTC:</span>
                  <span>{currentInvoice.total.toLocaleString()} FG</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Informations de Paiement</h4>
                <p><strong>Moyen de paiement:</strong> {payment.moyen}</p>
                <p><strong>Statut:</strong> {payment.statut}</p>
                {payment.transaction_id && <p><strong>Référence:</strong> {payment.transaction_id}</p>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-indigo-600" size={32} />
              <h3 className="text-xl font-bold text-gray-800">Paiement et Facturation</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Récapitulatif de la vente</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-semibold">{selectedClient?.nom_complet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles:</span>
                    <span className="font-semibold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total HT:</span>
                    <span className="font-semibold">{totals.total_ht.toLocaleString()} FG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA:</span>
                    <span className="font-semibold">{totals.total_tva.toLocaleString()} FG</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-indigo-600 border-t pt-2">
                    <span>Total TTC:</span>
                    <span>{totals.total_ttc.toLocaleString()} FG</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Détails des articles</h4>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.nom_produit}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantite} {item.unite_abreviation} × {item.prix_unitaire.toLocaleString()} FG
                      </p>
                    </div>
                    <span className="font-semibold">
                      {(item.prix_unitaire * item.quantite).toLocaleString()} FG
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Moyen de paiement</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="payment-method" className="block text-sm font-medium mb-2">Type de paiement</label>
                    <select
                      id="payment-method"
                      name="payment-method"
                      value={payment.moyen}
                      onChange={(e) => setPayment({ ...payment, moyen: e.target.value, transaction_id: '' })}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="cash">💵 Espèces</option>
                      <option value="mobile_money">📱 Mobile Money</option>
                      <option value="carte">💳 Carte Bancaire</option>
                      <option value="virement">🏦 Virement</option>
                    </select>
                  </div>

                  {payment.moyen !== 'cash' && (
                    <div>
                      <label htmlFor="transaction-id" className="block text-sm font-medium mb-2">
                        {payment.moyen === 'mobile_money' ? 'Numéro de transaction' : 
                         payment.moyen === 'carte' ? 'Référence carte' : 'Référence virement'}
                      </label>
                      <input
                        id="transaction-id"
                        name="transaction-id"
                        type="text"
                        value={payment.transaction_id}
                        onChange={(e) => setPayment({ ...payment, transaction_id: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`TXN-${Date.now()}`}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="payment-status" className="block text-sm font-medium mb-2">Statut du paiement</label>
                    <select
                      id="payment-status"
                      name="payment-status"
                      value={payment.statut}
                      onChange={(e) => setPayment({ ...payment, statut: e.target.value })}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="recu">✅ Reçu</option>
                      <option value="en_attente">⏳ En attente</option>
                      <option value="echec">❌ Échec</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Prêt à finaliser</h4>
                <p className="text-sm text-green-600 mb-4">
                  La vente sera enregistrée et une facture sera générée automatiquement.
                </p>
                <button
                  onClick={finalizeSale}
                  disabled={payment.moyen !== 'cash' && !payment.transaction_id.trim()}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText size={20} /> Finaliser la vente et générer la facture
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="mt-6 w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour au client
          </button>
        </div>
      </div>
    );
  }, [saleCompleted, currentInvoice, selectedClient, payment, cart, totals, printInvoice, startNewSale, finalizeSale]);

  const CatalogueTab = useMemo(() => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion du Catalogue</h2>
            <p className="text-gray-600">Produits, catégories et stocks</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Tag size={20} /> Catégories
            </button>
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={20} /> Nouveau Produit
            </button>
          </div>
        </div>

        {showCategoryForm && (
          <div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Gestion des Catégories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="category-name" className="block text-sm font-medium mb-1">Nom *</label>
                <input
                  id="category-name"
                  name="category-name"
                  type="text"
                  value={newCategory.nom}
                  onChange={(e) => setNewCategory({ ...newCategory, nom: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de la catégorie"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="category-description" className="block text-sm font-medium mb-1">Description</label>
                <input
                  id="category-description"
                  name="category-description"
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description de la catégorie"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCategory}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Créer la catégorie
              </button>
              <button
                onClick={() => setShowCategoryForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {showProductForm && (
          <div className="bg-gray-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h3>
              <button
                onClick={resetProductForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium mb-1">Nom du produit *</label>
                <input
                  id="product-name"
                  name="product-name"
                  type="text"
                  value={newProduct.nom_produit}
                  onChange={(e) => setNewProduct({ ...newProduct, nom_produit: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="product-reference" className="block text-sm font-medium mb-1">Référence *</label>
                <input
                  id="product-reference"
                  name="product-reference"
                  type="text"
                  value={newProduct.reference}
                  onChange={(e) => setNewProduct({ ...newProduct, reference: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="product-description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="product-description"
                  name="product-description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                />
              </div>
              <div>
                <label htmlFor="product-sale-price" className="block text-sm font-medium mb-1">Prix de vente (FG) *</label>
                <input
                  id="product-sale-price"
                  name="product-sale-price"
                  type="number"
                  value={newProduct.prix_vente}
                  onChange={(e) => setNewProduct({ ...newProduct, prix_vente: parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="product-purchase-price" className="block text-sm font-medium mb-1">Prix d'achat (FG)</label>
                <input
                  id="product-purchase-price"
                  name="product-purchase-price"
                  type="number"
                  value={newProduct.prix_achat}
                  onChange={(e) => setNewProduct({ ...newProduct, prix_achat: parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="product-category" className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  id="product-category"
                  name="product-category"
                  value={newProduct.categorie_id}
                  onChange={(e) => setNewProduct({ ...newProduct, categorie_id: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="product-base-unit" className="block text-sm font-medium mb-1">Unité de base *</label>
                <select
                  id="product-base-unit"
                  name="product-base-unit"
                  value={newProduct.unite_base_id}
                  onChange={(e) => setNewProduct({ ...newProduct, unite_base_id: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner une unité</option>
                  {unites.map(unite => (
                    <option key={unite.id} value={unite.id}>{unite.nom} ({unite.abreviation})</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="product-tax" className="block text-sm font-medium mb-1">TVA (%)</label>
                <input
                  id="product-tax"
                  name="product-tax"
                  type="number"
                  value={newProduct.tva}
                  onChange={(e) => setNewProduct({ ...newProduct, tva: parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label htmlFor="stock-initial" className="block text-sm font-medium mb-1">Stock initial *</label>
                <input
                  id="stock-initial"
                  name="stock-initial"
                  type="number"
                  value={newProduct.stock_initial}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_initial: parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="product-min-stock" className="block text-sm font-medium mb-1">Stock minimum</label>
                <input
                  id="product-min-stock"
                  name="product-min-stock"
                  type="number"
                  value={newProduct.stock_minimum}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_minimum: parseFloat(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="product-active"
                  name="product-active"
                  type="checkbox"
                  checked={newProduct.actif}
                  onChange={(e) => setNewProduct({ ...newProduct, actif: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="product-active" className="text-sm font-medium">Produit actif</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="product-ecommerce"
                  name="product-ecommerce"
                  type="checkbox"
                  checked={newProduct.disponible_ecommerce}
                  onChange={(e) => setNewProduct({ ...newProduct, disponible_ecommerce: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="product-ecommerce" className="text-sm font-medium">Disponible en e-commerce</label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Sous-unités de vente</h4>
                <button
                  onClick={addProduitUnite}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={16} /> Ajouter une sous-unité
                </button>
              </div>

              {newProduct.produit_unites.map((pu, index) => (
                <div key={pu.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 items-end border rounded p-3 bg-white">
                  <div>
                    <label htmlFor={`unit-${index}`} className="block text-xs font-medium mb-1">Unité</label>
                    <select
                      id={`unit-${index}`}
                      name={`unit-${index}`}
                      value={pu.unite_id}
                      onChange={(e) => updateProduitUnite(index, 'unite_id', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionner</option>
                      {unites.map(unite => (
                        <option key={unite.id} value={unite.id}>
                          {unite.nom} ({unite.abreviation})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`coefficient-${index}`} className="block text-xs font-medium mb-1">Coefficient</label>
                    <input
                      id={`coefficient-${index}`}
                      name={`coefficient-${index}`}
                      type="number"
                      value={pu.coefficient_vers_unite_base}
                      onChange={(e) => updateProduitUnite(index, 'coefficient_vers_unite_base', parseFloat(e.target.value) || 1)}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      min="0.001"
                      step="0.001"
                    />
                  </div>
                  <div>
                    <label htmlFor={`price-${index}`} className="block text-xs font-medium mb-1">Prix (FG)</label>
                    <input
                      id={`price-${index}`}
                      name={`price-${index}`}
                      type="number"
                      value={pu.prix_par_unite}
                      onChange={(e) => updateProduitUnite(index, 'prix_par_unite', parseFloat(e.target.value) || 0)}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={`base-unit-${index}`}
                      name={`base-unit-${index}`}
                      type="checkbox"
                      checked={pu.est_unite_base}
                      onChange={(e) => updateProduitUnite(index, 'est_unite_base', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor={`base-unit-${index}`} className="text-xs font-medium">Unité de base</label>
                  </div>
                  <button
                    onClick={() => removeProduitUnite(index)}
                    className="bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center p-2 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveProduct}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Save size={20} /> {editingProduct ? 'Modifier' : 'Créer'} le produit
              </button>
              <button
                onClick={resetProductForm}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {products.map(product => {
            const category = getCategorieById(product.categorie_id);
            const uniteBase = getUniteById(product.unite_base_id);
            const stock = product.stocks?.[0];

            return (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">{product.nom_produit}</h4>
                      {!product.actif && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Inactif</span>
                      )}
                      {category && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {category.nom}
                        </span>
                      )}
                      {stock?.stock_disponible <= product.stock_minimum && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Stock faible
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Référence:</span>
                        <p className="font-medium">{product.reference}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prix base:</span>
                        <p className="font-medium text-green-600">{product.prix_vente.toLocaleString()} FG</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <p className={`font-medium ${
                          stock?.stock_disponible <= product.stock_minimum ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {stock?.stock_disponible || 0} {uniteBase?.abreviation}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">TVA:</span>
                        <p className="font-medium">{product.tva}%</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setNewProduct(product);
                      setShowProductForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors ml-4"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Unités de vente disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.produit_unites?.map(pu => {
                      const unite = getUniteById(pu.unite_id);
                      // CORRECTION : Garantir l'affichage de l'abréviation
                      const uniteAbreviation = unite?.abreviation || 'unité';
                      const uniteNom = unite?.nom || 'Unité';

                      return (
                        <div
                          key={pu.id}
                          className={`px-3 py-2 rounded-lg border text-sm ${
                            pu.est_unite_base 
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-800' 
                              : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="font-medium">{uniteNom} ({uniteAbreviation})</div>
                          <div className="text-xs">
                            {pu.prix_par_unite.toLocaleString()} FG
                            {pu.coefficient_vers_unite_base !== 1 && 
                              ` (×${pu.coefficient_vers_unite_base})`
                            }
                            {pu.est_unite_base && <span className="ml-1">⭐</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ), [showProductForm, showCategoryForm, newProduct, newCategory, editingProduct, products, categories, unites, getCategorieById, getUniteById, addProduitUnite, updateProduitUnite, removeProduitUnite, saveProduct, resetProductForm, addCategory]);

  const UnitesTab = useMemo(() => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Unités</h2>
            <p className="text-gray-600">Unités de mesure et conversions</p>
          </div>
          <button
            onClick={() => setShowUniteForm(!showUniteForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Scale size={20} /> {showUniteForm ? 'Masquer le formulaire' : 'Nouvelle Unité'}
          </button>
        </div>

        {showUniteForm && (
          <div className="bg-gray-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Nouvelle Unité de Mesure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="unit-name" className="block text-sm font-medium mb-1">Nom *</label>
                <input
                  id="unit-name"
                  name="unit-name"
                  type="text"
                  value={newUnite.nom}
                  onChange={(e) => setNewUnite({ ...newUnite, nom: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: Kilogramme"
                />
              </div>
              <div>
                <label htmlFor="unit-abbreviation" className="block text-sm font-medium mb-1">Abréviation *</label>
                <input
                  id="unit-abbreviation"
                  name="unit-abbreviation"
                  type="text"
                  value={newUnite.abreviation}
                  onChange={(e) => setNewUnite({ ...newUnite, abreviation: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: kg"
                />
              </div>
              <div>
                <label htmlFor="unit-description" className="block text-sm font-medium mb-1">Description</label>
                <input
                  id="unit-description"
                  name="unit-description"
                  type="text"
                  value={newUnite.description}
                  onChange={(e) => setNewUnite({ ...newUnite, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Description de l'unité"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addUnite}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Save size={20} /> Créer l'unité
              </button>
              <button
                onClick={() => setShowUniteForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {unites.map(unite => (
            <div key={unite.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="text-indigo-600" size={24} />
                    <div>
                      <h4 className="font-bold text-lg">{unite.nom}</h4>
                      <p className="text-sm text-gray-600">{unite.abreviation}</p>
                    </div>
                  </div>
                  {unite.description && (
                    <p className="text-sm text-gray-600">{unite.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ), [showUniteForm, newUnite, unites, addUnite]);

  const HistoriqueTab = useMemo(() => {
    const stats = {
      totalVentes: ventes.length,
      chiffreAffaires: ventes.reduce((sum, v) => sum + v.montant_total, 0),
      moyennePanier: ventes.length > 0 ? ventes.reduce((sum, v) => sum + v.montant_total, 0) / ventes.length : 0,
      meilleurClient: ventes.reduce((acc, v) => {
        acc[v.nom_client] = (acc[v.nom_client] || 0) + 1;
        return acc;
      }, {})
    };

    const meilleurClient = Object.entries(stats.meilleurClient).sort((a, b) => b[1] - a[1])[0];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Historique des Ventes</h2>
              <p className="text-gray-600">Ventes, factures et paiements</p>
            </div>
            <button
              onClick={resetAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={20} /> Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="text-green-600" size={20} />
                <p className="text-sm text-green-600">Ventes Total</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.totalVentes}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-blue-600" size={20} />
                <p className="text-sm text-blue-600">Chiffre d'Affaires</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {stats.chiffreAffaires.toLocaleString()} FG
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-purple-600" size={20} />
                <p className="text-sm text-purple-600">Panier Moyen</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round(stats.moyennePanier).toLocaleString()} FG
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-orange-600" size={20} />
                <p className="text-sm text-orange-600">Meilleur Client</p>
              </div>
              <p className="text-lg font-bold text-orange-700">
                {meilleurClient ? `${meilleurClient[0]} (${meilleurClient[1]}x)` : 'Aucun'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dernières Ventes</h3>
            {ventes.slice().reverse().map(vente => {
              const facture = factures.find(f => f.vente_id === vente.id);
              const paiement = paiements.find(p => p.vente_id === vente.id);

              return (
                <div key={vente.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">Vente #{vente.id}</h4>
                      <p className="text-sm text-gray-600">{new Date(vente.date_vente).toLocaleDateString()}</p>
                      <p className="text-sm">Client: {vente.nom_client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{vente.montant_total.toLocaleString()} FG</p>
                      {facture && (
                        <p className="text-sm text-blue-600">Facture #{facture.id}</p>
                      )}
                      {paiement && (
                        <p className="text-sm text-gray-600 capitalize">{paiement.moyen} - {paiement.statut}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {vente.details?.length} articles • HT: {vente.total_ht.toLocaleString()} FG • TVA: {vente.total_tva.toLocaleString()} FG
                  </div>
                </div>
              );
            })}

            {ventes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                <p>Aucune vente enregistrée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [ventes, factures, paiements, resetAllData]);

  const ClientsTab = useMemo(() => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Clients</h2>
            <p className="text-gray-600">Clients fidèles et historiques</p>
          </div>
          <button
            onClick={() => setShowClientForm(!showClientForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Users size={20} /> {showClientForm ? 'Masquer le formulaire' : 'Nouveau Client'}
          </button>
        </div>

        {showClientForm && (
          <div className="bg-gray-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Nouveau Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="client-tab-nom" className="block text-sm font-medium mb-1">Nom complet *</label>
                <input
                  id="client-tab-nom"
                  name="client-tab-nom"
                  type="text"
                  value={newClient.nom_complet}
                  onChange={(e) => setNewClient({ ...newClient, nom_complet: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label htmlFor="client-tab-email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="client-tab-email"
                  name="client-tab-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label htmlFor="client-tab-telephone" className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  id="client-tab-telephone"
                  name="client-tab-telephone"
                  type="tel"
                  value={newClient.telephone}
                  onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+224 XXX XX XX XX"
                />
              </div>
              <div>
                <label htmlFor="client-tab-adresse" className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  id="client-tab-adresse"
                  name="client-tab-adresse"
                  type="text"
                  value={newClient.adresse}
                  onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Adresse complète"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addClient}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Créer le client
              </button>
              <button
                onClick={() => setShowClientForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {clients.map(client => {
            const clientVentes = ventes.filter(v => v.client_fidele_id === client.id);
            const totalAchats = clientVentes.reduce((sum, v) => sum + v.montant_total, 0);

            return (
              <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">{client.nom_complet}</h4>
                      {!client.actif && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Inactif</span>
                      )}
                      {clientVentes.length > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Fidèle ({clientVentes.length} achats)
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{client.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Téléphone:</span>
                        <p className="font-medium">{client.telephone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Adresse:</span>
                        <p className="font-medium">{client.adresse}</p>
                      </div>
                    </div>
                    {clientVentes.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        Total achats: {totalAchats.toLocaleString()} FG
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ), [showClientForm, newClient, clients, ventes, addClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <a href="#main-content" className="skip-link">Passer au contenu</a>

      {NotificationCenter}

      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="order-1 bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 text-white p-3 rounded-lg">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">FIMMA - Système de Vente</h1>
                <p className="text-gray-600">Boutique de tissus et textiles</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Boutique</p>
              <p className="font-semibold">Tissus & Textiles Aliou</p>
            </div>
          </div>
        </div>

        <main id="main-content" className="order-3" tabIndex="-1">
          {activeTab === 'ventes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Processus de Vente</h2>
                    <p className="text-gray-600">Gestion complète des ventes et facturation</p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(step => (
                      <div
                        key={step}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          currentStep === step
                            ? 'bg-indigo-600 text-white'
                            : currentStep > step
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {currentStep > step ? <Check size={24} /> : step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {currentStep === 1 && Step1Products}
              {currentStep === 2 && Step2Client}
              {currentStep === 3 && Step3Payment}
            </div>
          )}

          {activeTab === 'catalogue' && CatalogueTab}
          {activeTab === 'unites' && UnitesTab}
          {activeTab === 'clients' && ClientsTab}
          {activeTab === 'historique' && HistoriqueTab}
        </main>

        <nav className="order-2 bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'ventes', label: 'Ventes', icon: ShoppingCart },
              { id: 'catalogue', label: 'Catalogue', icon: Package },
              { id: 'unites', label: 'Unités', icon: Scale },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'historique', label: 'Historique', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <style jsx>{`
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: white;
          padding: 8px;
          z-index: 100;
          text-decoration: none;
        }
        .skip-link:focus {
          top: 0;
        }
      `}</style>
    </div>
  );
};

export default FimmaSaleSimulation;