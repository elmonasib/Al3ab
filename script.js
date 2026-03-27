// --- 1. إعدادات المتجر ---
const myPhoneNumber = "212600000000"; 
const placeholder = "https://via.placeholder.com/300x250?text=No+Image";

const container = document.getElementById('products-container');
const modal = document.getElementById('payment-modal');
const detailArea = document.getElementById('product-detail-area');
const whatsappBtn = document.getElementById('whatsapp-btn');
const policyModal = document.getElementById('policy-modal');
const policyTextArea = document.getElementById('policy-text-area');

let selectedProduct = null;

// --- 2. بيانات السياسات (من نحن والضمان) ---
const policies = {
    privacy: {
        title: "سياسة الخصوصية",
        content: "نحن في متجر النوادر نلتزم بحماية بياناتك. المعلومات التي تقدمها تُستخدم فقط لغرض التوصيل ولا يتم مشاركتها أبداً."
    },
    exchange: {
        title: "سياسة التبديل والضمان",
        content: "يمكن استبدال المنتج خلال 24 ساعة في حال وجود خلل فني غير موضح في وصف المنتج. يجب أن يكون المنتج بنفس الحالة التي استُلم بها."
    },
    refund: {
        title: "استرجاع النقود",
        content: "يتم استرداد المبلغ كاملاً في حال تبين أن المنتج غير مطابق للمواصفات المعروضة أو في حال وجود كسر ناتج عن الشحن."
    }
};

function showPolicy(type) {
    const policy = policies[type];
    if (policy && policyModal && policyTextArea) {
        policyTextArea.innerHTML = `
            <h2 style="color:var(--primary-orange); margin-bottom:15px;">${policy.title}</h2>
            <p style="line-height:1.8; color:#333;">${policy.content}</p>
        `;
        policyModal.style.display = 'flex';
    }
}

function showAbout() {
    if (policyModal && policyTextArea) {
        policyTextArea.innerHTML = `
            <h2 style="color:var(--primary-orange); margin-bottom:15px;">من نحن</h2>
            <p style="line-height:1.8; color:#333;">
                <b>متجر النوادر</b> هو منصة متخصصة في إحياء الذكريات وتقديم القطع النادرة والألعاب الكلاسيكية. 
                نحن نهتم بجودة المنتجات ونسعى لتوفير نوادر لا تجدها في أي مكان آخر لعشاق الأنتيك والريترو.
            </p>
        `;
        policyModal.style.display = 'flex';
    }
}

// --- 3. فحص المنتجات الجديدة ---
function isNewProduct(dateStr) {
    if (!dateStr) return false;
    const addedDate = new Date(dateStr);
    const today = new Date();
    return (Math.abs(today - addedDate) / (1000 * 60 * 60 * 24)) <= 7;
}

// --- 4. دالة عرض المنتجات (إعادة الطول والحالة) ---
function render(items) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        const isNew = isNewProduct(p.dateAdded);
        const img = (p.images && p.images.length > 0) ? p.images[0] : placeholder;

        card.innerHTML = `
            <div class="card-img-container">
                ${isNew ? '<span class="badge-new">جديد</span>' : ''}
                <img src="${img}" onerror="this.src='${placeholder}'">
            </div>
            <div class="card-info">
                <h3>${p.name}</h3>
                <div class="product-specs">
                    <span><i class="fas fa-ruler-vertical"></i> ${p.length || '--'}</span>
                    <span> | </span>
                    <span><i class="fas fa-tag"></i> ${p.status || 'مستعمل'}</span>
                </div>
                <span class="price">${p.price}</span>
            </div>
        `;
        card.onclick = (e) => { e.stopPropagation(); openModal(p); };
        container.appendChild(card);
    });
}

// --- 5. فتح نافذة المنتج (إعادة الطول والحالة في التفاصيل) ---
function openModal(p) {
    selectedProduct = p;
    const images = p.images || [placeholder];
    detailArea.innerHTML = `
        <img id="modal-main-img" src="${images[0]}" class="main-modal-img" style="width:100%; max-height:250px; object-fit:contain; border-radius:10px;">
        <h2 style="margin-top:20px; font-size:1.4rem;">${p.name}</h2>
        <div style="margin: 15px 0; text-align:right;">
            <p><b>الحالة:</b> <span style="color:#FF8C00;">${p.status || 'مستعمل'}</span></p>
            <p><b>الطول:</b> ${p.length || 'غير محدد'}</p>
        </div>
        <p style="color:#FF8C00; font-weight:bold; font-size:1.8rem;">${p.price}</p>
    `;
    modal.style.display = 'flex';
}

function closeModal() { if (modal) modal.style.display = 'none'; }
function closePolicyModal() { if (policyModal) policyModal.style.display = 'none'; }

// --- 6. القائمة والبحث والأقسام ---
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('active');
}

function filterByCategory(category, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    render(category === 'all' ? allProducts : allProducts.filter(p => p.cat === category));
}

function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    render(allProducts.filter(p => p.name.toLowerCase().includes(searchTerm)));
}

// --- 7. إدارة النقرات ---
window.onclick = (event) => {
    if (event.target == modal) closeModal();
    if (event.target == policyModal) closePolicyModal();
    
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    if (navLinks && navLinks.classList.contains('active')) {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => { if (typeof allProducts !== 'undefined') render(allProducts); });