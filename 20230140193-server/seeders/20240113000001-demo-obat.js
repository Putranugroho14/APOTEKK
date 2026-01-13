'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Cari user ID pertama untuk dijadikan authorId
        const [users] = await queryInterface.sequelize.query('SELECT id FROM Users LIMIT 1');
        const authorId = users && users.length > 0 ? users[0].id : 1;

        const obats = [
            {
                nama_obat: 'Paracetamol 500mg',
                deskripsi: 'Pereda demam dan nyeri ringan seperti sakit kepala dan sakit gigi.',
                stok: 100,
                harga: 15000,
                gambar_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Amoxicillin 500mg',
                deskripsi: 'Antibiotik untuk mengobati berbagai jenis infeksi bakteri.',
                stok: 50,
                harga: 25000,
                gambar_url: 'https://images.unsplash.com/photo-1471864190281-06399187310d?w=500',
                kategori: 'Obat Keras',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Sangobion Capsule',
                deskripsi: 'Suplemen zat besi dan vitamin untuk mengatasi anemia dan keletihan.',
                stok: 75,
                harga: 35000,
                gambar_url: 'https://images.unsplash.com/photo-1616671285442-7efbc5b699c4?w=500',
                kategori: 'Suplemen',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Vitamin C 1000mg',
                deskripsi: 'Suplemen kesehatan untuk menjaga sistem imun dan kesehatan kulit.',
                stok: 120,
                harga: 45000,
                gambar_url: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=500',
                kategori: 'Vitamin',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Decolgen Strip',
                deskripsi: 'Pereda gejala flu, hidung tersumbat, dan bersin-bersin.',
                stok: 200,
                harga: 12000,
                gambar_url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500',
                kategori: 'Obat Bebas Terbatas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Promag Tablet',
                deskripsi: 'Meredakan sakit maag, asam lambung, dan kembung dengan cepat.',
                stok: 150,
                harga: 10000,
                gambar_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Betadine Antiseptic 15ml',
                deskripsi: 'Cairan antiseptik untuk mencegah infeksi pada luka luar.',
                stok: 40,
                harga: 30000,
                gambar_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446ddd?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Diapet Strip',
                deskripsi: 'Membantu mengurangi frekuensi buang air besar dan memadatkan tinja.',
                stok: 90,
                harga: 5000,
                gambar_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Antimo Tablet',
                deskripsi: 'Mencegah mual dan muntah akibat mabuk perjalanan.',
                stok: 300,
                harga: 4000,
                gambar_url: 'https://images.unsplash.com/photo-1579165466541-71ae09b40339?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Neurobion Forte',
                deskripsi: 'Vitamin B1, B6, dan B12 untuk menjaga kesehatan saraf.',
                stok: 60,
                harga: 40000,
                gambar_url: 'https://images.unsplash.com/photo-1576091160550-2173dad99901?w=500',
                kategori: 'Vitamin',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Mylanta Cair 50ml',
                deskripsi: 'Obat maag cair dengan rasa mint yang menyejukkan.',
                stok: 30,
                harga: 28000,
                gambar_url: 'https://images.unsplash.com/photo-1555633514-abcee6ad93e1?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Enervon-C Effervescent',
                deskripsi: 'Multivitamin untuk memulihkan kondisi tubuh setelah sakit.',
                stok: 45,
                harga: 50000,
                gambar_url: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=500',
                kategori: 'Vitamin',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Bodrex Extra Strip',
                deskripsi: 'Formula ekstra untuk sakit kepala yang mencengkram.',
                stok: 110,
                harga: 14500,
                gambar_url: 'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Entrostop Tablet',
                deskripsi: 'Mengatasi diare non-spesifik dengan menyerap racun.',
                stok: 85,
                harga: 8000,
                gambar_url: 'https://images.unsplash.com/photo-1514733670139-4d47a4c6ad0b?w=500',
                kategori: 'Obat Bebas',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_obat: 'Ambroxol Syrup',
                deskripsi: 'Membantu mengencerkan dahak pada saluran pernapasan.',
                stok: 25,
                harga: 18000,
                gambar_url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500',
                kategori: 'Obat Keras',
                authorId: authorId,
                is_published: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        return queryInterface.bulkInsert('Obats', obats, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Obats', null, {});
    }
};
