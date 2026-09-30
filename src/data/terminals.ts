export interface Terminal {
  id: string;
  nama: string;
  alamat: string;
  kota: string;
  provinsi: string;
  tipe: 'A' | 'B' | 'C';
  // koordinat kasar untuk arah terminal, opsional
  lat?: number;
  lng?: number;
}

export const TERMINALS: Terminal[] = [
  // DKI Jakarta - prioritas utama aplikasi
  { id: 'pulo-gebang', nama: 'Terminal Pulo Gebang', alamat: 'Jl. Sejajar Sisi Tol Timur KM 2, Pulo Gebang, Cakung, Jakarta Timur', kota: 'Jakarta Timur', provinsi: 'DKI Jakarta', tipe: 'A', lat: -6.211, lng: 106.951 },
  { id: 'kampung-rambutan', nama: 'Terminal Kampung Rambutan', alamat: 'Jl. Terminal Kampung Rambutan, Ciracas, Jakarta Timur', kota: 'Jakarta Timur', provinsi: 'DKI Jakarta', tipe: 'A', lat: -6.31, lng: 106.881 },
  { id: 'kalideres', nama: 'Terminal Kalideres', alamat: 'Jl. Daan Mogot No.39, Kalideres, Jakarta Barat 11840', kota: 'Jakarta Barat', provinsi: 'DKI Jakarta', tipe: 'A', lat: -6.13, lng: 106.705 },
  { id: 'tanjung-priok', nama: 'Terminal Tanjung Priok', alamat: 'Jl. Enggano, Tanjung Priok, Jakarta Utara', kota: 'Jakarta Utara', provinsi: 'DKI Jakarta', tipe: 'A' },
  { id: 'pulo-gadung', nama: 'Terminal Pulo Gadung', alamat: 'Jl. Bekasi Raya, Pulo Gadung, Jakarta Timur', kota: 'Jakarta Timur', provinsi: 'DKI Jakarta', tipe: 'B' },
  // Banten
  { id: 'poris-plawad', nama: 'Terminal Poris Plawad', alamat: 'Jl. Benteng Betawi, Cipondoh, Tangerang 15141', kota: 'Tangerang', provinsi: 'Banten', tipe: 'A' },
  { id: 'pakupatan', nama: 'Terminal Pakupatan', alamat: 'Kel. Cipocok Jaya, Kec. Cipocok Jaya, Serang', kota: 'Serang', provinsi: 'Banten', tipe: 'A' },
  { id: 'merak', nama: 'Terminal Terpadu Merak', alamat: 'Jl. Raya Merak, Cilegon', kota: 'Cilegon', provinsi: 'Banten', tipe: 'A' },
  { id: 'pondok-cabe', nama: 'Terminal Pondok Cabe', alamat: 'Pamulang, Tangerang Selatan', kota: 'Tangerang Selatan', provinsi: 'Banten', tipe: 'A' },
  { id: 'labuan', nama: 'Terminal Labuan', alamat: 'Labuan', kota: 'Pandeglang', provinsi: 'Banten', tipe: 'A' },
  // Jawa Barat
  { id: 'leuwipanjang', nama: 'Terminal Leuwipanjang', alamat: 'Jl. Soekarno Hatta, Situsaeur, Bojongloa Kidul, Bandung 40233', kota: 'Bandung', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'harjamukti', nama: 'Terminal Harjamukti', alamat: 'Jl. By Pass Brigjen Dharsono, Cirebon', kota: 'Cirebon', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'bekasi', nama: 'Terminal Bekasi', alamat: 'Jl. Ir. H. Juanda, Bekasi', kota: 'Bekasi', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'jatijajar', nama: 'Terminal Jatijajar', alamat: 'Jl. Raya Jatijajar, Tapos, Depok', kota: 'Depok', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'baranangsiang', nama: 'Terminal Baranangsiang', alamat: 'Jl. Raya Pajajaran, Bogor', kota: 'Bogor', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'guntur-melati', nama: 'Terminal Guntur Melati', alamat: 'Jl. Guntur, Garut', kota: 'Garut', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'cicaheum', nama: 'Terminal Cicaheum', alamat: 'Jl. A.H. Nasution, Bandung', kota: 'Bandung', provinsi: 'Jawa Barat', tipe: 'B' },
  { id: 'cikarang', nama: 'Terminal Cikarang', alamat: 'Cikarang, Bekasi', kota: 'Bekasi', provinsi: 'Jawa Barat', tipe: 'B' },
  { id: 'indihiang', nama: 'Terminal Indihiang', alamat: 'Tasikmalaya', kota: 'Tasikmalaya', provinsi: 'Jawa Barat', tipe: 'A' },
  { id: 'singaparna', nama: 'Terminal Singaparna', alamat: 'Singaparna', kota: 'Tasikmalaya', provinsi: 'Jawa Barat', tipe: 'A' },
  // Jawa Tengah
  { id: 'tirtonadi', nama: 'Terminal Tirtonadi', alamat: 'Jl. Ahmad Yani No.262, Gilingan, Banjarsari, Surakarta 57134', kota: 'Surakarta', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'mangkang', nama: 'Terminal Mangkang', alamat: 'Jl. Raya Mangkang, Semarang', kota: 'Semarang', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'penggaron', nama: 'Terminal Penggaron', alamat: 'Semarang', kota: 'Semarang', provinsi: 'Jawa Tengah', tipe: 'B' },
  { id: 'bulupitu', nama: 'Terminal Bulupitu Purwokerto', alamat: 'Jl. Raya Bulupitu, Banyumas', kota: 'Banyumas', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'pekalongan', nama: 'Terminal Pekalongan', alamat: 'Jl. Dr. Sutomo, Pekalongan', kota: 'Pekalongan', provinsi: 'Jawa Tengah', tipe: 'A', lat: -6.889, lng: 109.674 },
  { id: 'tidar', nama: 'Terminal Tidar', alamat: 'Jl. Magelang-Yogyakarta, Magelang', kota: 'Magelang', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'mendolo', nama: 'Terminal Mendolo', alamat: 'Wonosobo', kota: 'Wonosobo', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'tegal', nama: 'Terminal Tegal', alamat: 'Jl. Mayjend Sutoyo, Tegal', kota: 'Tegal', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'kudus-jati', nama: 'Terminal Jati Kudus', alamat: 'Jl. Raya Kudus-Pati, Kudus', kota: 'Kudus', provinsi: 'Jawa Tengah', tipe: 'A' },
  { id: 'jepara', nama: 'Terminal Jepara', alamat: 'Jepara', kota: 'Jepara', provinsi: 'Jawa Tengah', tipe: 'B' },
  // DIY
  { id: 'giwangan', nama: 'Terminal Giwangan', alamat: 'Jl. Imogiri Timur Km 6, Giwangan, Umbulharjo, Yogyakarta', kota: 'Yogyakarta', provinsi: 'DI Yogyakarta', tipe: 'A', lat: -7.824, lng: 110.39 },
  { id: 'jombor', nama: 'Terminal Jombor', alamat: 'Jl. Magelang Km 6, Sleman', kota: 'Sleman', provinsi: 'DI Yogyakarta', tipe: 'B' },
  { id: 'condongcatur', nama: 'Terminal Condongcatur', alamat: 'Sleman', kota: 'Sleman', provinsi: 'DI Yogyakarta', tipe: 'B' },
  { id: 'dhaksinarga', nama: 'Terminal Dhaksinarga', alamat: 'Wonosari, Gunungkidul', kota: 'Gunungkidul', provinsi: 'DI Yogyakarta', tipe: 'A' },
  // Jawa Timur
  { id: 'purabaya', nama: 'Terminal Purabaya (Bungurasih)', alamat: 'Jl. Bungurasih Timur No.31, Waru, Sidoarjo 61256', kota: 'Sidoarjo', provinsi: 'Jawa Timur', tipe: 'A', lat: -7.35, lng: 112.725 },
  { id: 'arjosari', nama: 'Terminal Arjosari', alamat: 'Jl. Raden Intan, Arjosari, Malang', kota: 'Malang', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'osowilangun', nama: 'Terminal Tambak Osowilangun', alamat: 'Benowo, Surabaya', kota: 'Surabaya', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'purboyo', nama: 'Terminal Purboyo', alamat: 'Jl. Mastrip, Madiun', kota: 'Madiun', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'bayuangga', nama: 'Terminal Bayuangga', alamat: 'Probolinggo', kota: 'Probolinggo', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'sri-tanjung', nama: 'Terminal Sri Tanjung', alamat: 'Banyuwangi', kota: 'Banyuwangi', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'tawangalun', nama: 'Terminal Tawangalun', alamat: 'Jember', kota: 'Jember', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'kertonegoro', nama: 'Terminal Kertonegoro', alamat: 'Ngawi', kota: 'Ngawi', provinsi: 'Jawa Timur', tipe: 'A' },
  { id: 'tamanan', nama: 'Terminal Tamanan', alamat: 'Kediri', kota: 'Kediri', provinsi: 'Jawa Timur', tipe: 'A' },
  // Sumatera
  { id: 'amplas', nama: 'Terminal Amplas', alamat: 'Jl. Sisingamangaraja, Medan', kota: 'Medan', provinsi: 'Sumatera Utara', tipe: 'A' },
  { id: 'pinang-baris', nama: 'Terminal Pinang Baris', alamat: 'Medan', kota: 'Medan', provinsi: 'Sumatera Utara', tipe: 'A' },
  { id: 'anak-air', nama: 'Terminal Anak Air', alamat: 'Padang', kota: 'Padang', provinsi: 'Sumatera Barat', tipe: 'A' },
  { id: 'brps', nama: 'Terminal Bandar Raya Payung Sekaki', alamat: 'Pekanbaru', kota: 'Pekanbaru', provinsi: 'Riau', tipe: 'A' },
  { id: 'alam-barajo', nama: 'Terminal Alam Barajo', alamat: 'Jambi', kota: 'Jambi', provinsi: 'Jambi', tipe: 'A' },
  { id: 'alang-lebar', nama: 'Terminal Alang-Alang Lebar', alamat: 'Palembang', kota: 'Palembang', provinsi: 'Sumatera Selatan', tipe: 'A' },
  { id: 'rajabasa', nama: 'Terminal Rajabasa', alamat: 'Jl. By Pass Soekarno Hatta, Bandar Lampung', kota: 'Bandar Lampung', provinsi: 'Lampung', tipe: 'A' },
  { id: 'air-sebakul', nama: 'Terminal Air Sebakul', alamat: 'Bengkulu', kota: 'Bengkulu', provinsi: 'Bengkulu', tipe: 'A' },
  { id: 'batoh', nama: 'Terminal Batoh', alamat: 'Banda Aceh', kota: 'Banda Aceh', provinsi: 'Aceh', tipe: 'A' },
  { id: 'seicarang', nama: 'Terminal Sei Carang', alamat: 'Tanjung Pinang', kota: 'Tanjung Pinang', provinsi: 'Kepulauan Riau', tipe: 'A' },
  { id: 'selindung', nama: 'Terminal Selindung', alamat: 'Pangkal Pinang', kota: 'Pangkal Pinang', provinsi: 'Bangka Belitung', tipe: 'A' },
  // Bali + Nusa Tenggara
  { id: 'mengwi', nama: 'Terminal Mengwi', alamat: 'Mengwi, Badung, Bali', kota: 'Badung', provinsi: 'Bali', tipe: 'A' },
  { id: 'ubung', nama: 'Terminal Ubung', alamat: 'Denpasar', kota: 'Denpasar', provinsi: 'Bali', tipe: 'B' },
  { id: 'mandalika', nama: 'Terminal Mandalika', alamat: 'Mataram', kota: 'Mataram', provinsi: 'Nusa Tenggara Barat', tipe: 'A' },
  { id: 'noelbaki', nama: 'Terminal Noelbaki', alamat: 'Kupang', kota: 'Kupang', provinsi: 'Nusa Tenggara Timur', tipe: 'A' },
  // Kalimantan
  { id: 'ambawang', nama: 'Terminal Antar Negara Ambawang', alamat: 'Kubu Raya', kota: 'Kubu Raya', provinsi: 'Kalimantan Barat', tipe: 'A' },
  { id: 'wa-gara', nama: 'Terminal W.A. Gara', alamat: 'Palangka Raya', kota: 'Palangka Raya', provinsi: 'Kalimantan Tengah', tipe: 'A' },
  { id: 'gambut', nama: 'Terminal Gambut Barakat', alamat: 'Banjar', kota: 'Banjar', provinsi: 'Kalimantan Selatan', tipe: 'A' },
  { id: 'batu-ampar', nama: 'Terminal Batu Ampar', alamat: 'Balikpapan', kota: 'Balikpapan', provinsi: 'Kalimantan Timur', tipe: 'A' },
  { id: 'samarinda', nama: 'Terminal Samarinda Seberang', alamat: 'Samarinda', kota: 'Samarinda', provinsi: 'Kalimantan Timur', tipe: 'A' },
  { id: 'jelarai', nama: 'Terminal Jelarai Selor', alamat: 'Bulungan', kota: 'Bulungan', provinsi: 'Kalimantan Utara', tipe: 'A' },
  // Sulawesi
  { id: 'malalayang', nama: 'Terminal Malalayang', alamat: 'Manado', kota: 'Manado', provinsi: 'Sulawesi Utara', tipe: 'A' },
  { id: 'dungingi', nama: 'Terminal Dungingi', alamat: 'Gorontalo', kota: 'Gorontalo', provinsi: 'Gorontalo', tipe: 'A' },
  { id: 'tipo', nama: 'Terminal Tipo', alamat: 'Palu', kota: 'Palu', provinsi: 'Sulawesi Tengah', tipe: 'A' },
  { id: 'simbuang', nama: 'Terminal Simbuang', alamat: 'Mamuju', kota: 'Mamuju', provinsi: 'Sulawesi Barat', tipe: 'A' },
  { id: 'daya', nama: 'Terminal Daya', alamat: 'Makassar', kota: 'Makassar', provinsi: 'Sulawesi Selatan', tipe: 'A' },
  { id: 'puuwatu', nama: 'Terminal Puuwatu', alamat: 'Kendari', kota: 'Kendari', provinsi: 'Sulawesi Tenggara', tipe: 'A' },
  // Maluku + Papua
  { id: 'karang-panjang', nama: 'Terminal Karang Panjang', alamat: 'Ambon', kota: 'Ambon', provinsi: 'Maluku', tipe: 'A' },
  { id: 'takoma', nama: 'Terminal Takoma', alamat: 'Ternate', kota: 'Ternate', provinsi: 'Maluku Utara', tipe: 'A' },
  { id: 'entrop', nama: 'Terminal Entrop', alamat: 'Jayapura', kota: 'Jayapura', provinsi: 'Papua', tipe: 'A' },
  { id: 'sowi', nama: 'Terminal Sowi', alamat: 'Manokwari', kota: 'Manokwari', provinsi: 'Papua Barat', tipe: 'A' },
  { id: 'remu', nama: 'Terminal Remu', alamat: 'Sorong', kota: 'Sorong', provinsi: 'Papua Barat Daya', tipe: 'A' },
  { id: 'merauke', nama: 'Terminal Merauke', alamat: 'Merauke', kota: 'Merauke', provinsi: 'Papua Selatan', tipe: 'A' },
];

export function getTerminalById(id: string): Terminal | undefined {
  return TERMINALS.find((t) => t.id === id);
}

export function terminalLabel(t: Terminal): string {
  return `${t.nama}, ${t.kota}`;
}
