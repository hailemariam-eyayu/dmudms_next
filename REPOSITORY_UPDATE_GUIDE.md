# Repository Update Guide

## 🔄 How to Update Your GitHub Profile with Repository Data

### Option 1: Manual Update (Recommended for now)

1. **Go to your repositories**: https://github.com/hailemariam-eyayu?tab=repositories
2. **Copy repository information** and update the table in your README
3. **Update the statistics** based on your current data

### Option 2: Automatic Update with GitHub Actions

To set up automatic repository fetching:

1. **Create the profile repository** (if not exists):
   ```bash
   # Create a repository named exactly: hailemariam-eyayu
   # This special repository will show on your profile
   ```

2. **Copy the workflow file**:
   - Copy `.github/workflows/update-readme.yml` to your profile repository
   - Copy `update-readme.js` to your profile repository

3. **Set up GitHub Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Add it as a secret named `GITHUB_TOKEN` in your profile repository

4. **Copy the enhanced README**:
   - Copy the content from `GITHUB_PROFILE_README.md`
   - Paste it into your profile repository's `README.md`

### Current Repository Data Template

```markdown
| Repository | Description | Language | Stars | Forks | Size | Last Updated |
|------------|-------------|----------|-------|-------|------|--------------|
| [**dmudms_next**](https://github.com/hailemariam-eyayu/dmudms_next) | Modern dormitory management system | TypeScript | ⭐ 0 | 🍴 0 | 2.1MB | Dec 2024 |
| [**dmudms**](https://github.com/hailemariam-eyayu/dmudms) | Laravel dormitory management | PHP | ⭐ 0 | 🍴 0 | 1.8MB | Nov 2024 |
```

### Manual Statistics Update

Update these numbers based on your actual repositories:

```markdown
### 📈 Repository Statistics
- 📚 **[COUNT]** Public Repositories
- ⭐ **[STARS]** Total Stars  
- 🍴 **[FORKS]** Total Forks
- 💾 **[SIZE]** Total Code Size
- 📝 **[COMMITS]** Total Commits

### 🔥 Most Used Languages
- **PHP**: [COUNT] repositories
- **TypeScript**: [COUNT] repositories
- **JavaScript**: [COUNT] repositories
```

## 🚀 Quick Setup Steps

1. **Create profile repository**: `hailemariam-eyayu` (same as your username)
2. **Copy enhanced README**: Use the content from `GITHUB_PROFILE_README.md`
3. **Update repository data**: Manually update the table with your actual repositories
4. **Commit and push**: Your enhanced profile will be live!

## 📊 Repository Information to Collect

For each repository, gather:
- **Name** and **URL**
- **Description** (keep under 60 characters)
- **Primary Language**
- **Stars** and **Forks** count
- **Repository size** (visible in GitHub)
- **Last updated** date
- **Creation date**

## 🔧 Future Enhancements

Once the basic profile is set up, you can:
- Add GitHub Actions for automatic updates
- Include commit counts per repository
- Add repository topics/tags
- Include deployment status
- Add contribution graphs

---

**Note**: The automatic GitHub Actions approach requires a personal access token and proper repository setup. The manual approach is simpler and gives you full control over the content.