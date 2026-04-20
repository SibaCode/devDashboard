const tips = [
  "💡 Use `npx` to run tools without installing them globally.",
  "🛡️ Use environment variables for secrets instead of hardcoding.",
  "🚀 Press Ctrl+R in terminal to search command history.",
  "🔐 Use SSH instead of HTTPS to access GitHub repos.",
  "📌 Use `git stash` to save changes temporarily.",
  "⚡ Use aliases in .bashrc/.zshrc for long commands.",
];

const tipIndex = new Date().getDate() % tips.length;
document.getElementById("dailyTip").innerText = tips[tipIndex];

const data = [
  {
    title: "VPN Access",
    content: `
\`\`\`bash
sudo openvpn --config "fw1-jhb-TCP4-1197-Sibahle-config 1.ovpn"
\`\`\`

**Username:** Sibahle  
**Password:** \`796607\`  
**Alternate Password:** \`Op23@G3n3x\`
`
  },
  {
    title: "SSH Access",
    content: `
\`\`\`bash
ssh -p2222 siba@192.168.200.3
**Password:** \`Genex1324\`

ssh -p2222 siba@192.168.200.4
**Password:** \`Genex1324\`
\`\`\`
`
  },
{
  "title": "Deploy + Enable Auto Import + Restart Horizon (Insights)",
  "content": `
## Deploy Branch (IMPORTANT - Do this first)

\`\`\`bash
curl --location --request POST 'https://drone.genex.co.za/api/repos/genexsysops/ansible/builds?branch=aalIYOFt---Laravel-11&customer=257&repo_branch=master' \\
--header 'Authorization: Bearer YzRfmQdbJ44gZKWVhEmixEndLJjbV2wB'
\`\`\`

Then wait for build to complete successfully on Drone:
https://drone.genex.co.za

---

## Server Access

\`\`\`bash
ssh -p2222 siba@192.168.200.4
\`\`\`

(Enter verification code when prompted)

---

## Docker Container Access

\`\`\`bash
sudo docker exec -ti insights-257_phpcron_1 bash
\`\`\`

---

## Navigate to Project

\`\`\`bash
cd var/www/insights.genex.co.za/
\`\`\`

---

## Edit Environment File

\`\`\`bash
vi .env
\`\`\`

Add / update:

\`\`\`env
AUTO_IMPORT_PREIMPORT_ENABLED=true
AUTO_IMPORT_POSTIMPORT_ENABLED=true
AUTO_IMPORT_PREIMPORT_LINE_FEED_DETECTION=true
AUTO_IMPORT_PREIMPORT_CHECK_BOM=true
AUTO_IMPORT_POSTIMPORT_FILE_COUNT=true
\`\`\`

Save:
\`\`\`
Esc → :wq → Enter
\`\`\`

---

## Apply Config Changes

\`\`\`bash
php artisan config:cache
\`\`\`

Expected output:
\`\`\`
INFO  Configuration cached successfully.
\`\`\`

---

## Restart Horizon

\`\`\`bash
supervisorctl restart horizon
\`\`\`
`
}
,
  {
    title: "Stage Environment DB",
    content: `
To access the **Stage Database**, connect to the VPN first.

**DB Password:** \`Winter@54321\`
`
  },
  {
    title: "Git Merge Master into Branch",
    content: `
\`\`\`bash
git checkout your-branch
git pull origin your-branch
git checkout master
git pull origin master
git checkout your-branch
git merge origin/master
git push origin your-branch
\`\`\`
`
  },
  {
    title: "Deploy",
    content: `
### Step 1: Trigger Deployment

\`\`\`bash
curl --location --request POST 'https://drone.genex.co.za/api/repos/genexsysops/ansible/builds?branch=master&customer=34&repo_branch=master' \\
--header 'Authorization: Bearer YzRfmQdbJ44gZKWVhEmixEndLJjbV2wB'
\`\`\`

### Step 2:  
Track progress on the **#deployments** channel.
`
  },
  {
    title: "Docker Start",
    content: `
\`\`\`bash
docker ps
docker start my_container
\`\`\`
`
  },
  {
    title: "Long Instructions Example",
    content: `
# Step 1: Setup Environment  
Install Node.js from the official website. Choose the version compatible with your OS.

# Step 2: Initialize Project  
Run \`npm init\` in your project folder to create \`package.json\`.

# Step 3: Install Dependencies  
Use \`npm install express\` to install Express.js for your server.

# Step 4: Create Server File  
Create \`server.js\` with the following code:

\`\`\`js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
\`\`\`

# Step 5: Run Server  
Execute \`node server.js\` and visit http://localhost:3000
`
  }
];

const fuse = new Fuse(data, {
  keys: ['title', 'content'],
  threshold: 0.4,
  includeMatches: true
});

function highlightText(text, matches) {
  if (!matches || matches.length === 0) return text;
  let result = '', lastIndex = 0;
  matches[0].indices.forEach(([start, end]) => {
    result += text.slice(lastIndex, start);
    result += '<mark>' + text.slice(start, end + 1) + '</mark>';
    lastIndex = end + 1;
  });
  result += text.slice(lastIndex);
  return result;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}

function toggleExpand(button) {
  const container = button.parentNode;
  const preview = container.querySelector('.preview');
  const full = container.querySelector('.full');
  if (full.style.display === 'none' || full.style.display === '') {
    full.style.display = 'block';
    preview.style.display = 'none';
    button.textContent = 'Show Less';
  } else {
    full.style.display = 'none';
    preview.style.display = 'block';
    button.textContent = 'Read More';
  }
  Prism.highlightAll();
}

function renderResult(item, matches) {
  const maxPreviewLength = 200;
  const isLong = item.content.length > maxPreviewLength;
  const previewText = isLong ? item.content.slice(0, maxPreviewLength) + '...' : item.content;

  const contentHTML = marked.parse(item.content);
  const previewHTML = marked.parse(previewText);

  return `
    <div class="result">
      <div class="result-title">
        ${highlightText(item.title, matches.filter(m => m.key === 'title'))}
        <button class="copy-btn" onclick="copyToClipboard(\`${item.content.replace(/`/g, '\\`')}\`)">Copy</button>
      </div>
      <div class="result-content">
        <div class="preview">${previewHTML}</div>
        <div class="full">${contentHTML}</div>
        ${isLong ? `<button class="expand-btn" onclick="toggleExpand(this)">Read More</button>` : ''}
      </div>
    </div>
  `;
}

function search() {
  const query = document.getElementById("searchBox").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (!query) return;

  const results = fuse.search(query);
  results.forEach(result => {
    resultsDiv.innerHTML += renderResult(result.item, result.matches);
  });

  Prism.highlightAll();
}

const allSnippetsDiv = document.getElementById("allSnippets");

function renderAllSnippets() {
  allSnippetsDiv.innerHTML = "";
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "snippet-card";
    card.textContent = item.title;
    card.onclick = () => showSnippet(item);
    allSnippetsDiv.appendChild(card);
  });
}

function showSnippet(item) {
  document.getElementById("searchBox").value = "";
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = renderResult(item, []);
  Prism.highlightAll();
}

renderAllSnippets();
