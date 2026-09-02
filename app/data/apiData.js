export const API_DATA = [
  {
    category: '1. Autentikasi & Keamanan',
    endpoints: [
      {
        id: 'auth-info',
        title: 'Aturan Autentikasi & IP Whitelist',
        method: 'GET',
        path: '/api/kunjungan-ralan',
        description: 'Seluruh endpoint memerlukan Bearer Token pada HTTP Header dan alamat IP server Anda harus sudah terdaftar di IP Whitelist Rumah Sakit.',
        authRequired: true,
        params: [
          { name: 'Authorization', type: 'header', required: true, desc: 'Format: Bearer [TOKEN_API_KEY]' }
        ],
        sampleBody: null,
        responses: {
          401: { message: "Unauthorized. Invalid or inactive token." },
          403: { message: "Forbidden. IP address not allowed." }
        }
      }
    ]
  },
  {
    category: '2. Kunjungan Rawat Jalan (Ralan)',
    endpoints: [
      {
        id: 'ralan-total',
        title: 'Total Kunjungan Rawat Jalan',
        method: 'GET',
        path: '/api/kunjungan-ralan',
        description: 'Mendapatkan jumlah total kunjungan rawat jalan dalam satu periode.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD (Default: Tanggal 5 bulan ini/lalu)' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD (Default: Tanggal 4 bulan depan/ini)' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: "RSUD Manambai Abdul Kadir", kode_ppk_kemenkes: "5204013" },
            data: { tanggal_awal: "2026-08-05", tanggal_akhir: "2026-09-04", jumlah_kunjungan_ralan: 3240 }
          }
        }
      },
      {
        id: 'ralan-pj',
        title: 'Kunjungan Ralan Per Jenis Pembayaran',
        method: 'GET',
        path: '/api/kunjungan-ralan/per-pj',
        description: 'Jumlah kunjungan rawat jalan dikelompokkan per jenis pembayaran (BPJS, Umum, dll), diurutkan dari terbanyak.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: "RSUD Manambai Abdul Kadir", kode_ppk_kemenkes: "5204013" },
            data: {
              tanggal_awal: "2026-08-05",
              tanggal_akhir: "2026-09-04",
              per_jenis_pembayaran: [
                { kd_pj: "BPJ", jenis_pembayaran: "BPJS", jumlah_kunjungan: 2500 },
                { kd_pj: "UMM", jenis_pembayaran: "Umum", jumlah_kunjungan: 740 }
              ]
            }
          }
        }
      },
      {
        id: 'ralan-tanggal',
        title: 'Kunjungan Ralan Per Tanggal',
        method: 'GET',
        path: '/api/kunjungan-ralan/per-tanggal',
        description: 'Jumlah kunjungan rawat jalan dikelompokkan per tanggal dalam periode.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            data: { tanggal_awal: "2026-08-05", tanggal_akhir: "2026-09-04", rincian_harian: [] }
          }
        }
      }
    ]
  },
  {
    category: '3. Kunjungan Rawat Inap (Ranap)',
    endpoints: [
      {
        id: 'ranap-total',
        title: 'Total Kunjungan Rawat Inap',
        method: 'GET',
        path: '/api/kunjungan-ranap',
        description: 'Jumlah total kunjungan rawat inap (hitung pasien unik, mengecualikan Batal & Pindah Kamar).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: "RSUD Manambai Abdul Kadir", kode_ppk_kemenkes: "5204013" },
            data: { tanggal_awal: "2026-08-05", tanggal_akhir: "2026-09-04", jumlah_kunjungan_ranap: 410 }
          }
        }
      },
      {
        id: 'ranap-pj',
        title: 'Kunjungan Ranap Per Jenis Pembayaran',
        method: 'GET',
        path: '/api/kunjungan-ranap/per-pj',
        description: 'Jumlah kunjungan rawat inap dikelompokkan per jenis pembayaran.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            data: {
              per_jenis_pembayaran: [
                { kd_pj: "BPJ", jenis_pembayaran: "BPJS", jumlah_kunjungan: 310 },
                { kd_pj: "UMM", jenis_pembayaran: "Umum", jumlah_kunjungan: 100 }
              ]
            }
          }
        }
      }
    ]
  },
  {
    category: '4. Kunjungan IGD',
    endpoints: [
      {
        id: 'igd-total',
        title: 'Total Kunjungan IGD',
        method: 'GET',
        path: '/api/kunjungan-igd',
        description: 'Jumlah total kunjungan IGD (pasien unik dengan poliklinik kd_poli = IGDK).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: "RSUD Manambai Abdul Kadir", kode_ppk_kemenkes: "5204013" },
            data: { tanggal_awal: "2026-08-05", tanggal_akhir: "2026-09-04", jumlah_kunjungan_igd: 187 }
          }
        }
      },
      {
        id: 'igd-pj',
        title: 'Kunjungan IGD Per Jenis Pembayaran',
        method: 'GET',
        path: '/api/kunjungan-igd/per-pj',
        description: 'Jumlah kunjungan IGD dikelompokkan per jenis pembayaran.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            data: {
              per_jenis_pembayaran: [
                { kd_pj: "BPJ", jenis_pembayaran: "BPJS", jumlah_kunjungan: 130 },
                { kd_pj: "UMM", jenis_pembayaran: "Umum", jumlah_kunjungan: 57 }
              ]
            }
          }
        }
      }
    ]
  },
  {
    category: '5. Statistik Penyakit',
    endpoints: [
      {
        id: 'top10-ralan',
        title: 'Top 10 Penyakit Rawat Jalan',
        method: 'GET',
        path: '/api/penyakit-ralan/top10-ralan',
        description: 'Top 10 penyakit terbanyak pada pasien rawat jalan berdasarkan diagnosa primer (prioritas 1).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            data: {
              top_10_penyakit: [
                { kd_penyakit: "J06.9", nm_penyakit: "Infeksi Saluran Pernapasan Atas Akut", jumlah_pasien: 312 },
                { kd_penyakit: "K29.7", nm_penyakit: "Gastritis Tidak Spesifik", jumlah_pasien: 198 }
              ]
            }
          }
        }
      },
      {
        id: 'top10-ranap',
        title: 'Top 10 Penyakit Rawat Inap',
        method: 'GET',
        path: '/api/penyakit-ranap/top10-ranap',
        description: 'Top 10 penyakit terbanyak pada pasien rawat inap berdasarkan diagnosa primer.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            data: {
              top_10_penyakit: [
                { kd_penyakit: "I10", nm_penyakit: "Hipertensi Esensial", jumlah_pasien: 145 }
              ]
            }
          }
        }
      },
      {
        id: 'penyakit-kanker',
        title: 'Kasus Kanker (Neoplasma Ganas)',
        method: 'GET',
        path: '/api/penyakit/kanker',
        description: 'Jumlah kasus Kanker (Kode ICD-10: C00–C97) gabungan Ralan + Ranap.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            data: {
              keterangan: "Jumlah gabungan rawat jalan (Ralan) dan rawat inap (Ranap)",
              label: "Kanker (Neoplasma Ganas)",
              total_kasus: 87,
              per_jenis: [
                { kd_penyakit: "C34.9", nama: "Kanker Paru", jumlah_kasus: 22 },
                { kd_penyakit: "C50.9", nama: "Kanker Payudara", jumlah_kasus: 18 }
              ]
            }
          }
        }
      },
      {
        id: 'penyakit-jantung',
        title: 'Kasus Jantung & Pembuluh Darah',
        method: 'GET',
        path: '/api/penyakit/jantung',
        description: 'Jumlah kasus Jantung & Pembuluh Darah (ICD-10: I20–I52) gabungan Ralan + Ranap.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: { success: true, data: { label: "Jantung & Pembuluh Darah", total_kasus: 154 } }
        }
      },
      {
        id: 'penyakit-stroke',
        title: 'Kasus Stroke (Serebrovaskular)',
        method: 'GET',
        path: '/api/penyakit/stroke',
        description: 'Jumlah kasus Stroke (ICD-10: I60–I69) gabungan Ralan + Ranap.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: { success: true, data: { label: "Stroke (Serebrovaskular)", total_kasus: 92 } }
        }
      },
      {
        id: 'penyakit-uronefro',
        title: 'Kasus Ginjal & Saluran Kemih',
        method: 'GET',
        path: '/api/penyakit/uronefro',
        description: 'Jumlah kasus Ginjal & Saluran Kemih (ICD-10: N00–N39, Q60–Q64) gabungan Ralan + Ranap.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: { success: true, data: { label: "Ginjal & Saluran Kemih", total_kasus: 110 } }
        }
      }
    ]
  }
];