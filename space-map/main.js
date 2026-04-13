import './style.css';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';

console.log('Инициализация Space Map (Хаб) завершена!');

// 1. Создаем сцену
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020205); // Очень темный сине-черный

// 2. Настраиваем камеру
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 150);

// 3. Создаем рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Оптимизация для ретина-экранов
document.getElementById('app').appendChild(renderer.domElement);

// 4. Добавляем управление камерой (MapControls идеальны для 2D карты в 3D пространстве)
const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавная инерция
controls.dampingFactor = 0.05;
controls.enableRotate = false; // Запрещаем вращение, чтобы карта оставалась плоской
controls.minDistance = 20; // Максимальный зум
controls.maxDistance = 600; // Минимальный зум (отдаление)

// 5. Генерируем звездное небо (оптимизированно через BufferGeometry)
const starCount = 8000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  // Генерируем координаты X, Y, Z
  // Z делаем менее глубоким, чтобы звезды были больше похожи на слой
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 500 - 100;

  starPositions[i * 3] = x;
  starPositions[i * 3 + 1] = y;
  starPositions[i * 3 + 2] = z;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1.5,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true // Размер зависит от удаленности
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 6. Обработка изменения размера окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 7. Цикл анимации (Рендер-луп)
function animate() {
  requestAnimationFrame(animate);

  // Добавим немного динамики — медленное вращение фоновых звезд
  stars.rotation.z += 0.0001;

  controls.update(); // Важно вызывать для работы инерции (damping)
  renderer.render(scene, camera);
}

animate();
