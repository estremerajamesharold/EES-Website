// admin-script.js

// DOM Elements for Products Management
let productsTableBody, productModal, productForm, modalTitle, specsContainer, addSpecBtn;
let searchInput, categoryFilter, statusFilter;
let currentProductId = null;

// DOM Elements for News Management  
let newsTableBody, newsModal, newsForm;
let newsSearchInput, newsTypeFilter;
let currentNewsId = null;

// DOM Elements for Team Management
let teamGrid, teamModal, teamForm;
let teamSearchInput;
let currentMemberId = null;

// DOM Elements for Media Management
let mediaGrid, mediaModal, mediaForm;
let mediaSearchInput, mediaTypeFilter;
let currentMediaId = null;

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    
    if (pathname.includes('manage-products')) {
        initProductsPage();
    } else if (pathname.includes('manage-news')) {
        initNewsPage();
    } else if (pathname.includes('manage-team')) {
        initTeamPage();
    } else if (pathname.includes('manage-media')) {
        initMediaPage();
    } else if (pathname.includes('admin-dashboard')) {
        initDashboard();
    } else if (pathname.includes('manage-hero')) {
    initHeroPage();
    }
});

// Dashboard Initialization
function initDashboard() {
    // Toggle preview site
    const previewToggle = document.getElementById('previewToggle');
    const previewContainer = document.getElementById('previewContainer');
    
    if (previewToggle && previewContainer) {
        previewToggle.addEventListener('change', function() {
            if (this.checked) {
                previewContainer.classList.add('active');
            } else {
                previewContainer.classList.remove('active');
            }
        });
    }
    
    // Logout function
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if(confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }
}

// Products Page Initialization
function initProductsPage() {
    // Get DOM elements
    productsTableBody = document.getElementById('productsTableBody');
    productModal = document.getElementById('productModal');
    productForm = document.getElementById('productForm');
    modalTitle = document.getElementById('modalTitle');
    specsContainer = document.getElementById('specsContainer');
    addSpecBtn = document.getElementById('addSpecBtn');
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    statusFilter = document.getElementById('statusFilter');
    
    if (!productsTableBody) return;
    
    renderProducts();

    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        currentProductId = null;
        if (modalTitle) modalTitle.textContent = 'Add New Product';
        if (productForm) productForm.reset();
        if (specsContainer) specsContainer.innerHTML = '';
        openModal('productModal');
    });
    }
    
    // Event listeners
    if (addSpecBtn) {
        addSpecBtn.addEventListener('click', () => addSpecField());
    }
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }
    
    // Filter events
    if (searchInput) searchInput.addEventListener('input', renderProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', renderProducts);
    if (statusFilter) statusFilter.addEventListener('change', renderProducts);
}

// News Page Initialization  
function initNewsPage() {
    // Get DOM elements
    newsTableBody = document.getElementById('newsTableBody');
    newsModal = document.getElementById('newsModal');
    newsForm = document.getElementById('newsForm');
    newsSearchInput = document.getElementById('searchInput');
    newsTypeFilter = document.getElementById('typeFilter');
    
    if (!newsTableBody) return;
    
    renderNews();

    const addNewsBtn = document.getElementById('addNewsBtn');
    if (addNewsBtn) {
    addNewsBtn.addEventListener('click', () => {
        currentNewsId = null;
        if (modalTitle) modalTitle.textContent = 'Add New Article';
        if (newsForm) newsForm.reset();
        openModal('newsModal');
    });
    }
    
    // Event listeners
    if (newsForm) {
        newsForm.addEventListener('submit', saveNews);
    }
    
    // Filter events
    if (newsSearchInput) newsSearchInput.addEventListener('input', renderNews);
    if (newsTypeFilter) newsTypeFilter.addEventListener('change', renderNews);
}

// Team Page Initialization
function initTeamPage() {
    // Get DOM elements
    teamGrid = document.getElementById('teamGrid');
    teamModal = document.getElementById('teamModal');
    teamForm = document.getElementById('teamForm');
    teamSearchInput = document.getElementById('searchInput');
    
    if (!teamGrid) return;
    
    renderTeam();

    const addMemberBtn = document.getElementById('addMemberBtn');
    if (addMemberBtn) {
    addMemberBtn.addEventListener('click', () => {
        currentMemberId = null;
        if (modalTitle) modalTitle.textContent = 'Add New Team Member';
        if (teamForm) teamForm.reset();
        openModal('teamModal');
    });
    }
    
    // Event listeners
    if (teamForm) {
        teamForm.addEventListener('submit', saveTeamMember);
    }
    
    // Filter events
    if (teamSearchInput) teamSearchInput.addEventListener('input', renderTeam);
}

// Media Page Initialization
function initMediaPage() {
    // Get DOM elements
    mediaGrid = document.getElementById('mediaGrid');
    mediaModal = document.getElementById('mediaModal');
    mediaForm = document.getElementById('mediaForm');
    mediaSearchInput = document.getElementById('searchInput');
    mediaTypeFilter = document.getElementById('typeFilter');
    const mediaUrlInput = document.getElementById('mediaUrl');
    
    if (!mediaGrid) return;
    
    renderMedia();
    
    // Event listeners
    if (mediaForm) {
        mediaForm.addEventListener('submit', saveMediaItem);
    }
    if (mediaUrlInput) {
        mediaUrlInput.addEventListener('input', updatePreview);
    }
    const mediaTypeSelect = document.getElementById('mediaType');
    if (mediaTypeSelect) {
        mediaTypeSelect.addEventListener('change', updatePreview);
    }
    
    // Filter events
    if (mediaSearchInput) mediaSearchInput.addEventListener('input', renderMedia);
    if (mediaTypeFilter) mediaTypeFilter.addEventListener('change', renderMedia);
}

// PRODUCTS FUNCTIONS
function renderProducts() {
    const data = getSiteData();
    const products = data.products;
    
    if (!productsTableBody) return;
    
    // Get filter values
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const categoryValue = categoryFilter?.value || '';
    const statusValue = statusFilter?.value || '';
    
    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryValue || product.category === categoryValue;
        const matchesStatus = !statusValue || product.status === statusValue;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Clear table
    productsTableBody.innerHTML = '';
    
    // Add products to table
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image || 'https://via.placeholder.com/80x60'}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.category.toUpperCase()}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="status-${product.status}">${product.status === 'active' ? 'In Stock' : 'Out of Stock'}</span></td>
            <td class="actions">
                <button class="btn-edit" data-id="${product.id}" data-modal="productModal">Edit</button>
                <button class="btn-delete" data-id="${product.id}">Delete</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editProduct(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id)));
    });
}

function addSpecField(value = '') {
    if (!specsContainer) return;
    
    const specItem = document.createElement('div');
    specItem.className = 'spec-item';
    specItem.innerHTML = `
        <input type="text" placeholder="Label" value="${label}" style="flex: 1; margin-right: 10px;">
        <input type="text" placeholder="Value" value="${value}" style="flex: 2;">
        <button type="button" class="btn-delete-spec">✕</button>
    `;
    specsContainer.appendChild(specItem);
    
    // Add event listener to delete button
    specItem.querySelector('.btn-delete-spec').addEventListener('click', () => {
        specItem.remove();
    });
}

function editProduct(productId) {
    const data = getSiteData();
    const product = data.products.find(p => p.id === productId);
    if (!product || !productModal) return;
    
    currentProductId = productId;
    if (modalTitle) modalTitle.textContent = 'Edit Product';
    
    // Fill form with product data
    if (document.getElementById('productName')) document.getElementById('productName').value = product.name;
    if (document.getElementById('productCategory')) document.getElementById('productCategory').value = product.category;
    if (document.getElementById('productDescription')) document.getElementById('productDescription').value = product.description;
    if (document.getElementById('productPrice')) document.getElementById('productPrice').value = product.price;
    if (document.getElementById('productStatus')) document.getElementById('productStatus').value = product.status;
    if (document.getElementById('productImage')) document.getElementById('productImage').value = product.image || '';
    
    // Clear and add spec fields
    if (specsContainer) {
        specsContainer.innerHTML = '';
        // Replace: product.specs.forEach(spec => addSpecField(spec));
        product.specs.forEach(spec => {
        const [label, ...rest] = spec.split(': ');
        addSpecField(label, rest.join(': '));
        });
    }
    
    // Open modal
    openModal('productModal');
}

function saveProduct(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('productName')?.value;
    const category = document.getElementById('productCategory')?.value;
    const description = document.getElementById('productDescription')?.value;
    const price = parseFloat(document.getElementById('productPrice')?.value);
    const status = document.getElementById('productStatus')?.value;
    const image = document.getElementById('productImage')?.value;
    
    // Get specs
    const specs = specsContainer
        ? Array.from(specsContainer.querySelectorAll('.spec-item')).map(item => {
            const inputs = item.querySelectorAll('input');
            return `${inputs[0].value.trim()}: ${inputs[1].value.trim()}`;
            }).filter(spec => spec !== ': ')
        : [];
    
    if (!name || !category || !description || isNaN(price) || !status) {
        alert('Please fill in all required fields');
        return;
    }
    
    const data = getSiteData();
    let products = [...data.products];
    
    if (currentProductId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === currentProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                id: currentProductId,
                name,
                category,
                description,
                price,
                status,
                image,
                specs
            };
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category,
            description,
            price,
            status,
            image,
            specs
        });
    }
    
    // Save updated data
    saveSiteData({...data, products});
    
    // Close modal and refresh table
    closeModalHandler('productModal');
    renderProducts();
    alert(currentProductId ? 'Product updated successfully!' : 'Product added successfully!');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const data = getSiteData();
        const products = data.products.filter(p => p.id !== productId);
        saveSiteData({...data, products});
        renderProducts();
        alert('Product deleted successfully!');
    }
}

// NEWS FUNCTIONS
function renderNews() {
    const data = getSiteData();
    const newsItems = data.news;
    
    if (!newsTableBody) return;
    
    // Get filter values
    const searchTerm = newsSearchInput?.value.toLowerCase() || '';
    const typeValue = newsTypeFilter?.value || '';
    
    // Filter news items
    const filteredNews = newsItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                            item.excerpt.toLowerCase().includes(searchTerm) ||
                            item.content.toLowerCase().includes(searchTerm);
        const matchesType = !typeValue || item.type === typeValue;
        
        return matchesSearch && matchesType;
    });
    
    // Clear table
    newsTableBody.innerHTML = '';
    
    // Add news items to table
    filteredNews.forEach(item => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const typeLabel = item.type.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.title}</td>
            <td>${typeLabel}</td>
            <td>${item.excerpt}</td>
            <td class="actions">
                <button class="btn-edit" data-id="${item.id}" data-modal="newsModal">Edit</button>
                <button class="btn-delete" data-id="${item.id}">Delete</button>
            </td>
        `;
        newsTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editNews(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteNews(parseInt(btn.dataset.id)));
    });
}

function editNews(newsId) {
    const data = getSiteData();
    const item = data.news.find(n => n.id === newsId);
    if (!item || !newsModal) return;
    
    currentNewsId = newsId;
    if (modalTitle) modalTitle.textContent = 'Edit Article';
    
    // Fill form with news data
    if (document.getElementById('newsTitle')) document.getElementById('newsTitle').value = item.title;
    if (document.getElementById('newsType')) document.getElementById('newsType').value = item.type;
    if (document.getElementById('newsDate')) document.getElementById('newsDate').value = item.date;
    if (document.getElementById('newsExcerpt')) document.getElementById('newsExcerpt').value = item.excerpt;
    if (document.getElementById('newsContent')) document.getElementById('newsContent').value = item.content;
    
    // Open modal
    openModal('newsModal');
}

function saveNews(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('newsTitle')?.value;
    const type = document.getElementById('newsType')?.value;
    const date = document.getElementById('newsDate')?.value;
    const excerpt = document.getElementById('newsExcerpt')?.value;
    const content = document.getElementById('newsContent')?.value;
    
    if (!title || !type || !date || !excerpt || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    const data = getSiteData();
    let newsItems = [...data.news];
    
    if (currentNewsId) {
        // Update existing news item
        const newsIndex = newsItems.findIndex(n => n.id === currentNewsId);
        if (newsIndex !== -1) {
            newsItems[newsIndex] = {
                id: currentNewsId,
                title,
                type,
                date,
                excerpt,
                content
            };
        }
    } else {
        // Add new news item
        const newId = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.id)) + 1 : 1;
        newsItems.push({
            id: newId,
            title,
            type,
            date,
            excerpt,
            content
        });
    }
    
    // Save updated data
    saveSiteData({...data, news: newsItems});
    
    // Close modal and refresh table
    closeModalHandler('newsModal');
    renderNews();
    alert(currentNewsId ? 'Article updated successfully!' : 'Article added successfully!');
}

function deleteNews(newsId) {
    if (confirm('Are you sure you want to delete this article?')) {
        const data = getSiteData();
        const newsItems = data.news.filter(n => n.id !== newsId);
        saveSiteData({...data, news: newsItems});
        renderNews();
        alert('Article deleted successfully!');
    }
}

// TEAM FUNCTIONS
function renderTeam() {
    const data = getSiteData();
    const teamMembers = data.team;
    
    if (!teamGrid) return;
    
    // Get search term
    const searchTerm = teamSearchInput?.value.toLowerCase() || '';
    
    // Filter team members
    const filteredMembers = teamMembers.filter(member => {
        return member.name.toLowerCase().includes(searchTerm) || 
               member.position.toLowerCase().includes(searchTerm) ||
               member.bio.toLowerCase().includes(searchTerm);
    });
    
    // Clear grid
    teamGrid.innerHTML = '';
    
    // Add team members to grid
    filteredMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.innerHTML = `
            <div class="member-image">
                <img src="${member.image || 'https://via.placeholder.com/600x600'}" alt="${member.name}">
            </div>
            <div class="member-info">
                <h3>${member.name}</h3>
                <p class="position">${member.position}</p>
                <p>${member.bio}</p>
                <div class="member-actions">
                    <button class="btn-edit" data-id="${member.id}" data-modal="teamModal">Edit</button>
                    <button class="btn-delete" data-id="${member.id}">Delete</button>
                </div>
            </div>
        `;
        teamGrid.appendChild(memberCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editTeamMember(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteTeamMember(parseInt(btn.dataset.id)));
    });
}

function editTeamMember(memberId) {
    const data = getSiteData();
    const member = data.team.find(m => m.id === memberId);
    if (!member || !teamModal) return;
    
    currentMemberId = memberId;
    if (modalTitle) modalTitle.textContent = 'Edit Team Member';
    
    // Fill form with member data
    if (document.getElementById('memberName')) document.getElementById('memberName').value = member.name;
    if (document.getElementById('memberPosition')) document.getElementById('memberPosition').value = member.position;
    if (document.getElementById('memberBio')) document.getElementById('memberBio').value = member.bio;
    if (document.getElementById('memberImage')) document.getElementById('memberImage').value = member.image || '';
    
    // Open modal
    openModal('teamModal');
}

function saveTeamMember(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('memberName')?.value;
    const position = document.getElementById('memberPosition')?.value;
    const bio = document.getElementById('memberBio')?.value;
    const image = document.getElementById('memberImage')?.value;
    
    if (!name || !position || !bio) {
        alert('Please fill in all required fields');
        return;
    }
    
    const data = getSiteData();
    let teamMembers = [...data.team];
    
    if (currentMemberId) {
        // Update existing team member
        const memberIndex = teamMembers.findIndex(m => m.id === currentMemberId);
        if (memberIndex !== -1) {
            teamMembers[memberIndex] = {
                id: currentMemberId,
                name,
                position,
                bio,
                image
            };
        }
    } else {
        // Add new team member
        const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
        teamMembers.push({
            id: newId,
            name,
            position,
            bio,
            image
        });
    }
    
    // Save updated data
    saveSiteData({...data, team: teamMembers});
    
    // Close modal and refresh grid
    closeModalHandler('teamModal');
    renderTeam();
    alert(currentMemberId ? 'Team member updated successfully!' : 'Team member added successfully!');
}

function deleteTeamMember(memberId) {
    if (confirm('Are you sure you want to delete this team member?')) {
        const data = getSiteData();
        const teamMembers = data.team.filter(m => m.id !== memberId);
        saveSiteData({...data, team: teamMembers});
        renderTeam();
        alert('Team member deleted successfully!');
    }
}

// MEDIA FUNCTIONS
function renderMedia() {
    const data = getSiteData();
    const mediaItems = data.media;
    
    if (!mediaGrid) return;
    
    // Get filter values
    const searchTerm = mediaSearchInput?.value.toLowerCase() || '';
    const typeValue = mediaTypeFilter?.value || '';
    
    // Filter media items
    const filteredMedia = mediaItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            (item.alt && item.alt.toLowerCase().includes(searchTerm));
        const matchesType = !typeValue || item.type === typeValue;
        
        return matchesSearch && matchesType;
    });
    
    // Clear grid
    mediaGrid.innerHTML = '';
    
    // Add media items to grid
    filteredMedia.forEach(item => {
        let previewContent = '';
        if (item.type === 'image') {
            previewContent = `<img src="${item.url}" alt="${item.alt || item.name}">`;
        } else if (item.type === 'video') {
            previewContent = `<video src="${item.url}" muted></video>`;
        }
        
        const mediaCard = document.createElement('div');
        mediaCard.className = 'media-item';
        mediaCard.innerHTML = `
            <div class="media-preview">
                ${previewContent}
                <span class="media-type">${item.type.toUpperCase()}</span>
            </div>
            <div class="media-info">
                <h3>${item.name}</h3>
                <p>${item.alt || 'No description'}</p>
                <div class="media-actions">
                    <button class="btn-edit" data-id="${item.id}" data-modal="mediaModal">Edit</button>
                    <button class="btn-delete" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `;
        mediaGrid.appendChild(mediaCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editMediaItem(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteMediaItem(parseInt(btn.dataset.id)));
    });
}

function updatePreview() {
    const previewContainer = document.getElementById('previewContainer');
    const mediaUrlInput = document.getElementById('mediaUrl');
    const mediaTypeSelect = document.getElementById('mediaType');
    
    if (!previewContainer || !mediaUrlInput || !mediaTypeSelect) return;
    
    const url = mediaUrlInput.value;
    const type = mediaTypeSelect.value;
    
    if (!url) {
        previewContainer.innerHTML = '<p>Preview will appear here</p>';
        return;
    }
    
    if (type === 'image') {
        previewContainer.innerHTML = `<img src="${url}" alt="Preview">`;
    } else if (type === 'video') {
        previewContainer.innerHTML = `<video src="${url}" controls muted></video>`;
    } else {
        previewContainer.innerHTML = '<p>Please select a media type</p>';
    }
}

function editMediaItem(mediaId) {
    const data = getSiteData();
    const item = data.media.find(m => m.id === mediaId);
    if (!item || !mediaModal) return;
    
    currentMediaId = mediaId;
    if (modalTitle) modalTitle.textContent = 'Edit Media';
    
    // Fill form with media data
    if (document.getElementById('mediaName')) document.getElementById('mediaName').value = item.name;
    if (document.getElementById('mediaType')) document.getElementById('mediaType').value = item.type;
    if (document.getElementById('mediaUrl')) document.getElementById('mediaUrl').value = item.url;
    if (document.getElementById('mediaAlt')) document.getElementById('mediaAlt').value = item.alt || '';
    
    // Update preview
    updatePreview();
    
    // Open modal
    openModal('mediaModal');
}

function saveMediaItem(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('mediaName')?.value;
    const type = document.getElementById('mediaType')?.value;
    const url = document.getElementById('mediaUrl')?.value;
    const alt = document.getElementById('mediaAlt')?.value;
    
    if (!name || !type || !url) {
        alert('Please fill in all required fields');
        return;
    }
    
    const data = getSiteData();
    let mediaItems = [...data.media];
    
    if (currentMediaId) {
        // Update existing media item
        const mediaIndex = mediaItems.findIndex(m => m.id === currentMediaId);
        if (mediaIndex !== -1) {
            mediaItems[mediaIndex] = {
                id: currentMediaId,
                name,
                type,
                url,
                alt
            };
        }
    } else {
        // Add new media item
        const newId = mediaItems.length > 0 ? Math.max(...mediaItems.map(m => m.id)) + 1 : 1;
        mediaItems.push({
            id: newId,
            name,
            type,
            url,
            alt
        });
    }
    
    // Save updated data
    saveSiteData({...data, media: mediaItems});
    
    // Close modal and refresh grid
    closeModalHandler('mediaModal');
    renderMedia();
    alert(currentMediaId ? 'Media updated successfully!' : 'Media added successfully!');
}

function deleteMediaItem(mediaId) {
    if (confirm('Are you sure you want to delete this media item?')) {
        const data = getSiteData();
        const mediaItems = data.media.filter(m => m.id !== mediaId);
        saveSiteData({...data, media: mediaItems});
        renderMedia();
        alert('Media item deleted successfully!');
    }
}

// === HERO MANAGEMENT ===
let currentHeroId = null;
let heroSlidesGrid, heroForm;

function initHeroPage() {
  heroSlidesGrid = document.getElementById('heroSlidesGrid');
  heroForm = document.getElementById('heroForm');
  if (!heroSlidesGrid) return;
  renderHeroSlides();

  const addBtn = document.getElementById('addHeroSlideBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      currentHeroId = null;
      document.getElementById('heroModalTitle').textContent = 'Add New Slide';
      heroForm?.reset();
      openModal('heroModal');
    });
  }

  if (heroForm) heroForm.addEventListener('submit', saveHeroSlide);
}

function renderHeroSlides() {
  const data = getSiteData();
  const slides = data.heroSlides;
  if (!heroSlidesGrid) return;

  heroSlidesGrid.innerHTML = slides.map(slide => `
    <div class="hero-slide-card">
      <img src="${slide.image}" alt="${slide.title}">
      <div class="slide-content">
        <h3>${slide.title}</h3>
        <p>${slide.subtitle}</p>
      </div>
      <div class="slide-actions">
        <button class="btn-edit" data-id="${slide.id}">Edit</button>
        <button class="btn-delete" data-id="${slide.id}">Delete</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => editHeroSlide(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteHeroSlide(parseInt(btn.dataset.id)));
  });
}

function editHeroSlide(id) {
  const data = getSiteData();
  const slide = data.heroSlides.find(s => s.id === id);
  if (!slide) return;
  currentHeroId = id;
  document.getElementById('heroModalTitle').textContent = 'Edit Slide';
  document.getElementById('heroImage').value = slide.image;
  document.getElementById('heroTitle').value = slide.title;
  document.getElementById('heroSubtitle').value = slide.subtitle;
  openModal('heroModal');
}

function saveHeroSlide(e) {
  e.preventDefault();
  const image = document.getElementById('heroImage').value;
  const title = document.getElementById('heroTitle').value;
  const subtitle = document.getElementById('heroSubtitle').value;

  if (!image || !title || !subtitle) {
    alert('All fields are required.');
    return;
  }

  const data = getSiteData();
  let slides = [...data.heroSlides];

  if (currentHeroId) {
    const idx = slides.findIndex(s => s.id === currentHeroId);
    if (idx !== -1) {
      slides[idx] = { id: currentHeroId, image, title, subtitle };
    }
  } else {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
    slides.push({ id: newId, image, title, subtitle });
  }

  saveSiteData({ ...data, heroSlides: slides });
  closeModalHandler('heroModal');
  renderHeroSlides();
  alert(currentHeroId ? 'Slide updated!' : 'Slide added!');
}

function deleteHeroSlide(id) {
  if (confirm('Delete this slide?')) {
    const data = getSiteData();
    const slides = data.heroSlides.filter(s => s.id !== id);
    saveSiteData({ ...data, heroSlides: slides });
    renderHeroSlides();
    alert('Slide deleted!');
  }
}

// Media picker (works on all admin pages)
document.querySelectorAll('.btn-select-media').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetInput = document.getElementById(btn.dataset.target);
    const media = getSiteData().media.filter(m => m.type === 'image');
    if (media.length === 0) {
      alert('No images in media library. Upload one first!');
      return;
    }
    
    // Create modal
    const picker = document.createElement('div');
    picker.className = 'modal';
    picker.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <h2>Select Image</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px,1fr)); gap: 10px; max-height: 300px; overflow-y: auto;">
          ${media.map(m => `
            <img src="${m.url}" alt="${m.name}" style="width:100%; cursor:pointer; border: 2px solid transparent;" 
                 onclick="document.getElementById('${btn.dataset.target}').value='${m.url}'; document.querySelector('.modal').remove();">
          `).join('')}
        </div>
        <button class="btn-cancel" style="margin-top: 15px;" onclick="this.closest('.modal').remove()">Cancel</button>
      </div>
    `;
    document.body.appendChild(picker);
  });
});