const gallery = document.getElementById('gallery');
let page = 1;

// Головна функція завантаження
const fetchImages = async () => {
    try {
        // Fetch повертає проміс, page++ збільшує лічильник одразу після використання
        const response = await fetch(`https://picsum.photos/v2/list?page=${page++}&limit=4`);
        const data = await response.json();

        // Fragment дозволяє додати всі елементи за 1 перемальовування DOM (швидкодія)
        const fragment = document.createDocumentFragment();

        data.forEach(({ id, author }) => { // Деструктуризація об'єкта одразу
            const img = document.createElement('img');
            img.src = `https://picsum.photos/id/${id}/400/300`; // Оптимізований розмір
            img.alt = author;
            fragment.appendChild(img);
        });

        gallery.appendChild(fragment);
    } catch (e) {
        console.error('API Error'); // Мінімальна обробка помилок
    }
};

// Об'єкт із функціями для кнопок
const actions = {
    loadMore: fetchImages,
    clearGallery: () => gallery.innerHTML = '',
    // ?.remove() замінює if(element) element.remove()
    removeLast: () => gallery.lastElementChild?.remove(),
    // Розвертаємо і вставляємо назад (append переміщує існуючі ноди)
    reverseGallery: () => gallery.append(...Array.from(gallery.children).reverse()),
    // Сортуємо випадковим чином і вставляємо назад
    shuffleGallery: () => gallery.append(...Array.from(gallery.children).sort(() => Math.random() - 0.5))
};

// Єдиний слухач подій на контейнер кнопок (Event Delegation)
document.querySelector('.buttons').addEventListener('click', (e) => {
    // Викликаємо функцію тільки якщо клікнули по кнопці з відомим ID
    actions[e.target.id]?.();
});

// Перший запуск
fetchImages();