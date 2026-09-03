export const API_DATA = [
  {
    category: '1. Autentikasi & Keamanan',
    endpoints: [
      {
        id: 'auth-token',
        title: 'Mendapatkan Bearer Token',
        method: 'POST',
        path: '/api/auth/token',
        description: 'Endpoint ini digunakan untuk mendapatkan Bearer JWT Token yang sah menggunakan Client ID dan Client Secret yang telah didaftarkan oleh Tim IT RS H.L Manambai AbdulKadir.',
        authRequired: false,
        params: [
          { name: 'client_id', type: 'body', required: true, desc: 'Client ID resmi instansi/dinas Anda.' },
          { name: 'client_secret', type: 'body', required: true, desc: 'Secret Key resmi yang diberikan Tim IT RS.' }
        ],
        sampleBody: {
          client_id: 'instansi_dinas_01',
          client_secret: 'sec_live_9f8d7e6a5b4c3d2e1a'
        },
        responses: {
          200: {
            success: true,
            message: 'Autentikasi berhasil',
            data: {
              token_type: 'Bearer',
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              expires_in: 86400
            }
          },
          401: { message: 'Client ID atau Secret Key tidak valid.' }
        }
      },
      {
        id: 'auth-info',
        title: 'Aturan Autentikasi & IP Whitelist',
        method: 'GET',
        path: '/api/kunjungan-ralan',
        description: 'Seluruh endpoint penarikan data memerlukan HTTP Header Authorization bertipe Bearer Token. Selain itu, alamat IP server pengirim wajib sudah terdaftar pada sistem IP Whitelist Rumah Sakit.',
        authRequired: true,
        params: [
          { name: 'Authorization', type: 'header', required: true, desc: 'Format: Bearer [TOKEN_API_KEY]' }
        ],
        sampleBody: null,
        responses: {
          401: { message: 'Unauthorized. Invalid or inactive token.' },
          403: { message: 'Forbidden. IP address not allowed.' }
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
        description: 'Mendapatkan jumlah total kunjungan pasien rawat jalan dalam satu periode.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD (Default: Tanggal 5 bulan ini/lalu)' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD (Default: Tanggal 4 bulan depan/ini)' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: { tanggal_awal: '2026-08-05', tanggal_akhir: '2026-09-04', jumlah_kunjungan_ralan: 3240 }
          },
          422: {
            message: 'Format tanggal_awal harus YYYY-MM-DD, contoh: 2026-08-05',
            errors: { tanggal_awal: ['Format tanggal_awal harus YYYY-MM-DD, contoh: 2026-08-05'] }
          }
        }
      },
      {
        id: 'ralan-pj',
        title: 'Kunjungan Ralan Per Jenis Pembayaran',
        method: 'GET',
        path: '/api/kunjungan-ralan/per-pj',
        description: 'Jumlah kunjungan rawat jalan dikelompokkan berdasarkan jenis penjamin/pembayaran (BPJS, Umum, dll), diurutkan dari jumlah terbanyak.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              per_jenis_pembayaran: [
                { kd_pj: 'BPJ', jenis_pembayaran: 'BPJS', jumlah_kunjungan: 2500 },
                { kd_pj: 'UMM', jenis_pembayaran: 'Umum', jumlah_kunjungan: 740 }
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
        description: 'Jumlah kunjungan rawat jalan dikelompokkan secara mendetail per tanggal dalam satu periode.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              rincian_harian: [
                { tanggal: '2026-08-05', jumlah_kunjungan: 120 },
                { tanggal: '2026-08-06', jumlah_kunjungan: 115 }
              ]
            }
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
        description: 'Jumlah total kunjungan rawat inap (dihitung berdasarkan pasien unik, mengecualikan status Batal dan Pindah Kamar).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: { tanggal_awal: '2026-08-05', tanggal_akhir: '2026-09-04', jumlah_kunjungan_ranap: 410 }
          }
        }
      },
      {
        id: 'ranap-pj',
        title: 'Kunjungan Ranap Per Jenis Pembayaran',
        method: 'GET',
        path: '/api/kunjungan-ranap/per-pj',
        description: 'Jumlah kunjungan rawat inap dikelompokkan berdasarkan jenis pembayaran (diurutkan dari terbanyak, pasien unik).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              per_jenis_pembayaran: [
                { kd_pj: 'BPJ', jenis_pembayaran: 'BPJS', jumlah_kunjungan: 310 },
                { kd_pj: 'UMM', jenis_pembayaran: 'Umum', jumlah_kunjungan: 100 }
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
        description: 'Jumlah total kunjungan pasien IGD (pasien unik terdaftar di poliklinik kd_poli = IGDK).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: { tanggal_awal: '2026-08-05', tanggal_akhir: '2026-09-04', jumlah_kunjungan_igd: 187 }
          }
        }
      },
      {
        id: 'igd-pj',
        title: 'Kunjungan IGD Per Jenis Pembayaran',
        method: 'GET',
        path: '/api/kunjungan-igd/per-pj',
        description: 'Jumlah kunjungan IGD dikelompokkan berdasarkan jenis pembayaran.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              per_jenis_pembayaran: [
                { kd_pj: 'BPJ', jenis_pembayaran: 'BPJS', jumlah_kunjungan: 130 },
                { kd_pj: 'UMM', jenis_pembayaran: 'Umum', jumlah_kunjungan: 57 }
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
        description: 'Top 10 diagnosis penyakit terbanyak pada pasien rawat jalan berdasarkan diagnosa primer (prioritas 1).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              top_10_penyakit: [
                { kd_penyakit: 'J06.9', nm_penyakit: 'Infeksi Saluran Pernapasan Atas Akut', jumlah_pasien: 312 },
                { kd_penyakit: 'K29.7', nm_penyakit: 'Gastritis Tidak Spesifik', jumlah_pasien: 198 }
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
        description: 'Top 10 diagnosis penyakit terbanyak pada pasien rawat inap berdasarkan diagnosa primer (prioritas 1).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              top_10_penyakit: [
                { kd_penyakit: 'I10', nm_penyakit: 'Hipertensi Esensial', jumlah_pasien: 145 }
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
        description: 'Jumlah total kasus Kanker (Neoplasma Ganas dengan kode ICD-10 C00–C97) gabungan Rawat Jalan dan Rawat Inap.',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              keterangan: 'Jumlah gabungan rawat jalan (Ralan) dan rawat inap (Ranap)',
              label: 'Kanker (Neoplasma Ganas)',
              total_kasus: 87,
              per_jenis: [
                { kd_penyakit: 'C34.9', nama: 'Kanker Paru', jumlah_kasus: 22 },
                { kd_penyakit: 'C50.9', nama: 'Kanker Payudara', jumlah_kasus: 18 },
                { kd_penyakit: 'C53.9', nama: 'Kanker Serviks', jumlah_kasus: 15 },
                { kd_penyakit: 'C18.9', nama: 'Kanker Kolon/Usus Besar', jumlah_kasus: 10 },
                { kd_penyakit: null, nama: 'Kanker (Neoplasma Ganas) Lainnya', jumlah_kasus: 22 }
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
        description: 'Jumlah total kasus Jantung & Pembuluh Darah (Rentang ICD-10: I20–I52) gabungan Ralan + Ranap (misal: Infark Miokard, Angina Pectoris, Gagal Jantung).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              keterangan: 'Jumlah gabungan rawat jalan (Ralan) dan rawat inap (Ranap)',
              label: 'Jantung & Pembuluh Darah',
              total_kasus: 154
            }
          }
        }
      },
      {
        id: 'penyakit-stroke',
        title: 'Kasus Stroke (Serebrovaskular)',
        method: 'GET',
        path: '/api/penyakit/stroke',
        description: 'Jumlah total kasus Stroke (Rentang ICD-10: I60–I69) gabungan Ralan + Ranap (misal: Stroke Iskemik, Stroke Hemoragik).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              keterangan: 'Jumlah gabungan rawat jalan (Ralan) dan rawat inap (Ranap)',
              label: 'Stroke (Serebrovaskular)',
              total_kasus: 92
            }
          }
        }
      },
      {
        id: 'penyakit-uronefro',
        title: 'Kasus Ginjal & Saluran Kemih',
        method: 'GET',
        path: '/api/penyakit/uronefro',
        description: 'Jumlah total kasus Ginjal & Saluran Kemih (Rentang ICD-10: N00–N39 dan Q60–Q64) gabungan Ralan + Ranap (misal: CKD, Batu Ginjal, Gagal Ginjal Akut).',
        authRequired: true,
        params: [
          { name: 'tanggal_awal', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' },
          { name: 'tanggal_akhir', type: 'query', required: false, desc: 'Format: YYYY-MM-DD' }
        ],
        sampleBody: null,
        responses: {
          200: {
            success: true,
            instansi: { nama_instansi: 'RS H.L Manambai AbdulKadir', kode_ppk_kemenkes: '5204013' },
            data: {
              tanggal_awal: '2026-08-05',
              tanggal_akhir: '2026-09-04',
              keterangan: 'Jumlah gabungan rawat jalan (Ralan) dan rawat inap (Ranap)',
              label: 'Ginjal & Saluran Kemih',
              total_kasus: 110
            }
          }
        }
      }
    ]
  }
];