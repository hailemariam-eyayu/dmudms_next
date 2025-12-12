// Manual script to fetch repository data without GitHub token
// This version uses public API endpoints only

const https = require('https');
const fs = require('fs');

const GITHUB_USERNAME = 'hailemariam-eyayu';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Node.js Script'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function fetchRepositoriesManual() {
  try {
    console.log('🔍 Fetching repositories for', GITHUB_USERNAME);
    
    // Fetch repositories
    const repositories = await makeRequest(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );
    
    console.log(`📊 Found ${repositories.length} repositories`);
    
    // Filter and process repositories
    const filteredRepos = repositories
      .filter(repo => !repo.fork && !repo.name.includes(GITHUB_USERNAME))
      .slice(0, 15);
    
    const repoData = [];
    
    for (const repo of filteredRepos) {
      console.log(`📈 Processing ${repo.name}...`);
      
      try {
        // For public repos, we can estimate commits or use a default
        let commitCount = 'N/A';
        
        // Try to get languages
        const languages = await makeRequest(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`
        );
        
        const primaryLanguage = Object.keys(languages)[0] || repo.language || 'Unknown';
        
        repoData.push({
          name: repo.name,
          description: repo.description || 'No description available',
          language: primaryLanguage,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          commits: commitCount,
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          url: repo.html_url,
          topics: repo.topics || [],
          size: repo.size,
          createdAt: new Date(repo.created_at).toLocaleDateString()
        });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.log(`⚠️ Error processing ${repo.name}:`, error.message);
        
        repoData.push({
          name: repo.name,
          description: repo.description || 'No description available',
          language: repo.language || 'Unknown',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          commits: 'N/A',
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          url: repo.html_url,
          topics: repo.topics || [],
          size: repo.size,
          createdAt: new Date(repo.created_at).toLocaleDateString()
        });
      }
    }
    
    return repoData;
    
  } catch (error) {
    console.error('❌ Error fetching repositories:', error.message);
    return [];
  }
}

function generateMarkdownTable(repositories) {
  let markdown = `
## 📊 My GitHub Repositories

| Repository | Description | Language | Stars | Forks | Size | Created |
|------------|-------------|----------|-------|-------|------|---------|
`;

  repositories.forEach(repo => {
    const truncatedDesc = repo.description.length > 60 
      ? repo.description.substring(0, 60) + '...' 
      : repo.description;
    
    const sizeKB = Math.round(repo.size);
    const sizeDisplay = sizeKB > 1024 ? `${Math.round(sizeKB/1024)}MB` : `${sizeKB}KB`;
    
    markdown += `| [**${repo.name}**](${repo.url}) | ${truncatedDesc} | ${repo.language} | ⭐ ${repo.stars} | 🍴 ${repo.forks} | ${sizeDisplay} | ${repo.createdAt} |\n`;
  });

  return markdown;
}

function generateStatistics(repositories) {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
  const totalSize = repositories.reduce((sum, repo) => sum + repo.size, 0);
  
  const languages = {};
  repositories.forEach(repo => {
    if (repo.language && repo.language !== 'Unknown') {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  
  const topLanguages = Object.entries(languages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  return {
    totalRepositories: repositories.length,
    totalStars,
    totalForks,
    totalSize: Math.round(totalSize / 1024), // Convert to MB
    topLanguages
  };
}

async function generateRepositorySection() {
  console.log('🚀 Generating repository section...');
  
  const repositories = await fetchRepositoriesManual();
  
  if (repositories.length === 0) {
    console.log('⚠️ No repositories found');
    return;
  }
  
  const stats = generateStatistics(repositories);
  const markdownTable = generateMarkdownTable(repositories);
  
  const repositorySection = `
${markdownTable}

### 📈 Repository Statistics
- 📚 **${stats.totalRepositories}** Public Repositories
- ⭐ **${stats.totalStars}** Total Stars  
- 🍴 **${stats.totalForks}** Total Forks
- 💾 **${stats.totalSize}MB** Total Code Size

### 🔥 Most Used Languages
${stats.topLanguages.map(([lang, count]) => `- **${lang}**: ${count} repositories`).join('\n')}

*Repository data fetched on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*

---
`;

  // Save to file
  fs.writeFileSync('repository-section.md', repositorySection);
  
  console.log('✅ Repository section generated!');
  console.log('📄 Saved to: repository-section.md');
  console.log(`📊 Processed ${repositories.length} repositories`);
  console.log(`⭐ Total stars: ${stats.totalStars}`);
  
  // Also log the section for easy copying
  console.log('\n📋 Copy this section to your README:');
  console.log('=' .repeat(50));
  console.log(repositorySection);
}

// Run the generator
generateRepositorySection().catch(console.error);