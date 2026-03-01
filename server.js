const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ======= DATA =======
const menuItems = [
  { id: 1, category: 'مشويات', name: 'جراد البحر الملكي', desc: 'جراد بحر طازج مشوي على الفحم مع زبدة الثوم وعصير الليمون الأصفر', price: 320, emoji: '🦞', tag: 'الأكثر طلباً' },
  { id: 2, category: 'مشويات', name: 'فيليه سمك قاروص', desc: 'قاروص طازج مشوي بالأعشاب مع بيوريه البطاطا والكمأة البيضاء', price: 220, emoji: '🐟', tag: '' },
  { id: 3, category: 'مشويات', name: 'سمك الدنيس المشوي', desc: 'دنيس طازج بالليمون والروزماري مع خضروات الموسم', price: 195, emoji: '🐠', tag: '' },
  { id: 4, category: 'مشويات', name: 'سمك البوري المشوي', desc: 'بوري مشوي على الفحم بتتبيلة الثوم والكزبرة الطازجة', price: 175, emoji: '🐡', tag: '' },
  { id: 5, category: 'مأكولات بحرية', name: 'كابوريا ستيمد', desc: 'كابوريا طازجة على البخار مع صلصة الجينجر والصويا الفاخرة', price: 290, emoji: '🦀', tag: 'جديد' },
  { id: 6, category: 'مأكولات بحرية', name: 'جمبري تيمبورا', desc: 'جمبري نمر كبير في عجينة تيمبورا خفيفة مع صلصة الترياكي', price: 165, emoji: '🍤', tag: '' },
  { id: 7, category: 'مأكولات بحرية', name: 'حبار كريمي فاخر', desc: 'حبار طري محشو بالجمبري وجبن الريكوتا في صلصة الزعفران', price: 185, emoji: '🦑', tag: '' },
  { id: 8, category: 'مأكولات بحرية', name: 'محار البحر المشوي', desc: 'محار طازج مشوي بزبدة الأعشاب وجبن البارميزان', price: 145, emoji: '🐚', tag: '' },
  { id: 9, category: 'مأكولات بحرية', name: 'جمبري بالثوم والزبدة', desc: 'جمبري ملكي مطبوخ بالزبدة والثوم المحمر والبقدونس الطازج', price: 155, emoji: '🦐', tag: '' },
  { id: 10, category: 'مأكولات بحرية', name: 'أخطبوط مشوي', desc: 'أخطبوط طري مشوي بزيت الزيتون والليمون والأعشاب المتوسطية', price: 210, emoji: '🐙', tag: 'جديد' },
  { id: 11, category: 'مقبلات', name: 'سلطة السيفود', desc: 'مزيج طازج من الجمبري والحبار والأسقلوب مع صلصة الليمون', price: 95, emoji: '🥗', tag: '' },
  { id: 12, category: 'مقبلات', name: 'شوربة السيفود', desc: 'شوربة كريمية غنية بالمأكولات البحرية الطازجة والزعفران', price: 75, emoji: '🍲', tag: 'الأكثر طلباً' },
  { id: 13, category: 'مقبلات', name: 'فتة الجمبري', desc: 'خبز محمص مع الجمبري المتبل والخل والثوم الحار', price: 85, emoji: '🫕', tag: '' },
  { id: 14, category: 'مقبلات', name: 'براوني الكابوريا', desc: 'كابوريا مقلية بعجينة مقرمشة مع صلصة التارتار', price: 110, emoji: '🦀', tag: '' },
  { id: 15, category: 'حلويات', name: 'كريم بروليه', desc: 'كريم بروليه كلاسيكي بنكهة الفانيليا وقشر الليمون', price: 65, emoji: '🍮', tag: '' },
  { id: 16, category: 'حلويات', name: 'تشيز كيك البحر', desc: 'تشيز كيك فاخر بصلصة التوت البري وقطع الفراولة الطازجة', price: 75, emoji: '🍰', tag: '' },
];

const reservations = [];

// ======= ROUTES =======

// Get full menu
app.get('/api/menu', (req, res) => {
  const { category } = req.query;
  const items = category ? menuItems.filter(i => i.category === category) : menuItems;
  res.json({ success: true, count: items.length, data: items });
});

// Get categories
app.get('/api/menu/categories', (req, res) => {
  const categories = [...new Set(menuItems.map(i => i.category))];
  res.json({ success: true, data: categories });
});

// Get single item
app.get('/api/menu/:id', (req, res) => {
  const item = menuItems.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'الطبق غير موجود' });
  res.json({ success: true, data: item });
});

// Create reservation
app.post('/api/reservations', (req, res) => {
  const { name, phone, date, time, guests, occasion, notes } = req.body;
  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة' });
  }
  const reservation = {
    id: Date.now(),
    name, phone, date, time, guests,
    occasion: occasion || 'عشاء عادي',
    notes: notes || '',
    status: 'مؤكد',
    createdAt: new Date().toISOString()
  };
  reservations.push(reservation);
  res.status(201).json({
    success: true,
    message: `تم تأكيد حجزك يا ${name}! في انتظارك يوم ${date} الساعة ${time}`,
    data: { id: reservation.id, status: reservation.status }
  });
});

// Get all reservations (admin)
app.get('/api/reservations', (req, res) => {
  res.json({ success: true, count: reservations.length, data: reservations });
});

// Contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !message) return res.status(400).json({ success: false, message: 'الاسم والرسالة مطلوبان' });
  console.log('New contact:', { name, email, message });
  res.json({ success: true, message: 'تم استلام رسالتك وسنرد عليك قريباً!' });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 مطعم الشيف يعمل على: http://localhost:${PORT}`));

module.exports = app;
