import fs from "fs";
import path from "path";
import https from "https";

const targets = [
  {
    filePath: "public/images/categories/hinges.jpg",
    query: "door hinge steel hardware",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/categories/handles.jpg",
    query: "door handle brass modern",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/categories/fasteners.jpg",
    query: "screws bolts hardware nuts",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/use-cases/bathroom.jpg",
    query: "modern luxury bathroom architecture",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/use-cases/main-entrance.jpg",
    query: "modern luxury front entrance door",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/use-cases/bedroom.jpg",
    query: "modern bedroom interior wooden door",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/banners/aldrop.jpg",
    query: "vintage door bolt lock brass",
    params: "w=800&h=500&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/banners/locks.jpg",
    query: "door security lock key metal",
    params: "w=800&h=500&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/banners/hinges.jpg",
    query: "heavy duty metal hinges architecture",
    params: "w=800&h=500&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/products/yale-mortise-lock.jpg",
    query: "brass mortise door lock hardware",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/products/godrej-digital-lock.jpg",
    query: "smart digital door lock biometric",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/products/ss-butt-hinge.jpg",
    query: "stainless steel butt hinge hardware",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/products/aldrop-tower-bolt.jpg",
    query: "door latch bolt lock sliding",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/products/cabinet-pull.jpg",
    query: "chrome cabinet drawer handle pull",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  },
  {
    filePath: "public/images/products/rawl-anchor-bolt.jpg",
    query: "steel anchor bolts hardware construction",
    params: "w=600&h=600&auto=format&fit=crop&q=85"
  }
];

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  for (const item of targets) {
    if (fs.existsSync(item.filePath)) {
      console.log(`Already exists: ${item.filePath}`);
      continue;
    }

    try {
      console.log(`Searching for: ${item.query}...`);
      const searchUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(item.query)}&per_page=5`;
      const data = await fetchJSON(searchUrl);
      const results = data.results || [];
      if (results.length === 0) {
        console.warn(`No results for ${item.query}`);
        continue;
      }
      
      const photo = results[0];
      const rawUrl = photo.urls?.raw || photo.urls?.regular;
      const downloadUrl = `${rawUrl}&${item.params}`;
      
      console.log(`Downloading ${item.filePath} from ${rawUrl}...`);
      await downloadFile(downloadUrl, item.filePath);
      console.log(`✓ Saved ${item.filePath}`);
    } catch (err) {
      console.error(`Failed ${item.filePath}:`, err.message);
    }
  }
}

run();
