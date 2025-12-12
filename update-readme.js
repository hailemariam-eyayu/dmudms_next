const axios = require('axios');
const fs = require('fs');

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'hailemariam-eyayu';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

async function fetchRepositories() {
  try {
    console.log('🔍 Fetching repositories...');
    
    // Fetch all repositories
    const reposResponse = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers }
    );
    
    const repositories = reposResponse.data;
    console.log(`📊 Found ${repositories.length} repositories`);
    
    // Filter out forks and get relevant data
    const filteredRepos = repositories
      .filter(repo => !repo.fork && !repo.name.includes(GITHUB_USERNAME)) // Exclude profile repo
      .slice(0, 10); // Limit to top 10 repositories
    
    const repoData = [];
    
    for (const repo of filteredRepos) {
      console.log(`📈 Processing ${repo.name}...`);
      
      try {
        // Fetch commit count
        const commitsResponse = await axios.get(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`,
          { headers }
        );
        
        // Get total commit count from Link header
        const linkHeader = commitsResponse.headers.link;
        let commitCount = 1;
        
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            commitCount = parseInt(lastPageMatch[1]);
          }
        }
        
        // Get primary language
        const languagesResponse = await axios.get(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
          { headers }
        );
        
        const languages = languagesResponse.data;
        const primaryLanguage = Object.keys(languages)[0] || 'Unknown';
        
        repoData.push({
          name: repo.name,
          description: repo.description || 'No description available',
          language: primaryLanguage,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          commits: commitCount,
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          url: repo.html_url,
          topics: repo.topics || []
        });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`⚠️ Error processing ${repo.name}:`, error.message);
        
        // Add basic data even if commit count fails
        repoData.push({
          name: repo.name,
          description: repo.description || 'No description available',
          language: repo.language || 'Unknown',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          commits: 'N/A',
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          url: repo.html_url,
          topics: repo.topics || []
        });
      }
    }
    
    return repoData;
    
  } catch (error) {
    console.error('❌ Error fetching repositories:', error.message);
    return [];
  }
}

function generateRepositoryTable(repositories) {
  let table = `<table>
<tr>
<th>Repository</th>
<th>Description</th>
<th>Language</th>
<th>Stars</th>
<th>Forks</th>
<th>Commits</th>
<th>Last Updated</th>
</tr>
`;

  repositories.forEach(repo => {
    const languageBadge = getLanguageBadge(repo.language);
    const truncatedDesc = repo.description.length > 50 
      ? repo.description.substring(0, 50) + '...' 
      : repo.description;
    
    table += `
<tr>
<td><a href="${repo.url}"><strong>${repo.name}</strong></a></td>
<td>${truncatedDesc}</td>
<td>${languageBadge}</td>
<td>⭐ ${repo.stars}</td>
<td>🍴 ${repo.forks}</td>
<td>📝 ${repo.commits}</td>
<td>${repo.lastUpdated}</td>
</tr>`;
  });

  table += '\n</table>';
  return table;
}

function getLanguageBadge(language) {
  const badges = {
    'JavaScript': '![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)',
    'TypeScript': '![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)',
    'PHP': '![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white)',
    'Python': '![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)',
    'Java': '![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=java&logoColor=white)',
    'Dart': '![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white)',
    'HTML': '![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white)',
    'CSS': '![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)',
    'C++': '![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=c%2B%2B&logoColor=white)',
    'C': '![C](https://img.shields.io/badge/C-A8B9CC?style=flat-square&logo=c&logoColor=black)'
  };
  
  return badges[language] || `![${language}](https://img.shields.io/badge/${language}-gray?style=flat-square)`;
}

function generateStatistics(repositories) {
  const totalCommits = repositories.reduce((sum, repo) => {
    return sum + (typeof repo.commits === 'number' ? repo.commits : 0);
  }, 0);
  
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
  
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
    totalCommits,
    totalStars,
    totalForks,
    topLanguages
  };
}

async function updateReadme() {
  console.log('🚀 Starting README update...');
  
  const repositories = await fetchRepositories();
  
  if (repositories.length === 0) {
    console.log('⚠️ No repositories found, skipping update');
    return;
  }
  
  const stats = generateStatistics(repositories);
  const repositoryTable = generateRepositoryTable(repositories);
  
  // Read current README
  let readmeContent = '';
  try {
    readmeContent = fs.readFileSync('README.md', 'utf8');
  } catch (error) {
    console.log('📄 README.md not found, creating new one...');
    readmeContent = fs.readFileSync('GITHUB_PROFILE_README.md', 'utf8');
  }
  
  // Update repository table
  const updatedContent = readmeContent.replace(
    /<!-- REPOSITORY_LIST_START -->[\s\S]*<!-- REPOSITORY_LIST_END -->/,
    `<!-- REPOSITORY_LIST_START -->
${repositoryTable}

### 📈 Quick Stats
- 📚 **${stats.totalRepositories}** Public Repositories
- 📝 **${stats.totalCommits}** Total Commits
- ⭐ **${stats.totalStars}** Total Stars
- 🍴 **${stats.totalForks}** Total Forks

### 🔥 Top Languages
${stats.topLanguages.map(([lang, count]) => `- **${lang}**: ${count} repositories`).join('\n')}

*Last updated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
<!-- REPOSITORY_LIST_END -->`
  );
  
  // Write updated README
  fs.writeFileSync('README.md', updatedContent);
  
  console.log('✅ README updated successfully!');
  console.log(`📊 Updated with ${repositories.length} repositories`);
  console.log(`📝 Total commits: ${stats.totalCommits}`);
}

// Run the update
updateReadme().catch(console.error);