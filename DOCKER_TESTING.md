# Docker Testing Guide for n8n Node

This guide explains how to test the Notion Cover Gen n8n node locally using Docker.

## 🚀 Quick Start

```bash
# Make the script executable (if not already)
chmod +x docker-test.sh

# Start n8n with the custom node
./docker-test.sh start

# Access n8n at http://localhost:5678
# Username: admin
# Password: admin
```

## 📋 Prerequisites

- Docker installed and running
- Docker Compose installed
- Bash shell (Linux/macOS) or Git Bash (Windows)

## 🎯 Available Commands

### Start n8n
```bash
./docker-test.sh start
```
Builds the Docker image with the custom node and starts n8n.

### Stop n8n
```bash
./docker-test.sh stop
```
Stops the n8n container.

### Restart n8n
```bash
./docker-test.sh restart
```
Restarts the n8n container without rebuilding.

### View Logs
```bash
./docker-test.sh logs
```
Shows real-time logs from n8n (Ctrl+C to exit).

### Rebuild from Scratch
```bash
./docker-test.sh rebuild
```
Completely rebuilds the Docker image (useful after code changes).

### Check Status
```bash
./docker-test.sh status
```
Shows the current status of Docker containers.

### Clean Everything
```bash
./docker-test.sh clean
```
Removes all containers, images, and volumes (start fresh).

## 🧪 Testing the Node

### 1. Access n8n

After starting, open your browser and navigate to:
```
http://localhost:5678
```

Login with:
- **Username**: `admin`
- **Password**: `admin`

### 2. Find the Node

1. Create a new workflow
2. Click the `+` button to add a node
3. Search for "Notion Cover Gen"
4. The node should appear in the **Transform** category

### 3. Configure Credentials (Optional)

If you want to test Freepik image search:

1. Go to **Credentials** (top menu)
2. Click **Add Credential**
3. Select "Notion Cover Gen API"
4. Enter your Freepik API key
5. Click **Save**

### 4. Test Operations

#### Test Generate Operation

1. Add a "Notion Cover Gen" node
2. Select **Operation**: `Generate`
3. Set **Text**: `"Docker Test Cover"`
4. Set **Template Path**: `/home/node/templates/notion.svg`
5. Set **Output Path**: `/home/node/outputs/test-cover`
6. Enable **Generate PNG**: `true`
7. Click **Execute Node**

#### Test with Freepik Search

1. Operation: `Generate`
2. Text: `"AI Technology"`
3. Enable **Use Freepik Search**: `true`
4. Search Caption: `"artificial intelligence technology"`
5. Template Path: `/home/node/templates/notion.svg`
6. Output Path: `/home/node/outputs/ai-cover`
7. Enable **Crop to 5:2 Ratio**: `true`
8. Gaussian Blur: `5`
9. Click **Execute Node**

#### Test Convert Operation

1. First, generate an SVG using the Generate operation
2. Add another "Notion Cover Gen" node
3. Operation: `Convert`
4. Input SVG Path: `/home/node/outputs/test-cover.svg`
5. Output PNG Path: `/home/node/outputs/converted.png`
6. Scale: `2`
7. Click **Execute Node**

#### Test Replace Background

1. Operation: `Replace Background`
2. Template SVG Path: `/home/node/templates/notion.svg`
3. Image Path: (path to a test image you've uploaded)
4. Enable **Crop to 5:2 Ratio**: `true`
5. Gaussian Blur: `10`
6. Click **Execute Node**

## 📁 File Locations

### Inside the Container

- **Templates**: `/home/node/templates/`
- **Outputs**: `/home/node/outputs/`
- **Node modules**: `/home/node/.n8n/node_modules/@oriolrius/notion-cover-gen`

### On Your Host Machine

- **Templates**: `./templates/`
- **Outputs**: `./n8n-outputs/` (created automatically)
- **n8n data**: Docker volume `n8n_data`

## 🔧 Troubleshooting

### Node not appearing in n8n

1. Check Docker logs:
   ```bash
   ./docker-test.sh logs
   ```

2. Look for errors related to node loading

3. Try rebuilding:
   ```bash
   ./docker-test.sh rebuild
   ```

### "Template file not found" error

Make sure you're using the correct path inside the container:
```
/home/node/templates/notion.svg
```

NOT your local path like `./templates/notion.svg`

### "Cannot write to output directory"

Use the mounted output directory:
```
/home/node/outputs/your-file-name
```

The files will appear in `./n8n-outputs/` on your host machine.

### Freepik API not working

1. Check your API key in the credentials
2. Or set it in the `.env` file:
   ```bash
   FREEPIK_API_KEY=your_actual_key_here
   ```
3. Restart the container:
   ```bash
   ./docker-test.sh restart
   ```

### Changes to node code not reflected

After modifying the node code, you must rebuild:
```bash
./docker-test.sh rebuild
```

## 🎨 Development Workflow

### 1. Make Code Changes

Edit files in `nodes/NotionCoverGen/`:
- `NotionCoverGen.node.ts`
- `NotionCoverGenApi.credentials.ts`

### 2. Rebuild & Test

```bash
./docker-test.sh rebuild
```

### 3. Check Logs

```bash
./docker-test.sh logs
```

### 4. Test in n8n

Go to http://localhost:5678 and test your changes.

## 📊 Monitoring

### View Container Status
```bash
docker ps
```

### View Resource Usage
```bash
docker stats n8n-notion-cover-gen-test
```

### Inspect n8n Data Volume
```bash
docker volume inspect notion-cover-gen_n8n_data
```

## 🧹 Cleanup

### Remove only the container
```bash
./docker-test.sh stop
```

### Remove everything (including data)
```bash
./docker-test.sh clean
```

This will delete:
- The n8n container
- The Docker image
- The n8n data volume (workflows, credentials)
- Network configuration

## 💡 Tips

1. **Persistent Data**: Your workflows and credentials are stored in a Docker volume, so they persist between restarts

2. **Output Files**: Check `./n8n-outputs/` on your host to see generated files

3. **Template Access**: The templates are mounted read-only, so you can't modify them from inside n8n

4. **Live Logs**: Keep logs running in a separate terminal to see real-time output

5. **Quick Testing**: Use the n8n's "Execute Node" button to test quickly without running the full workflow

## 🔗 Related Documentation

- [N8N Node Documentation](./N8N_NODE.md) - Full node usage guide
- [README](./README.md) - General project documentation
- [n8n Official Docs](https://docs.n8n.io/) - n8n documentation

## 🐛 Known Issues

1. **Font rendering**: Some system fonts may not be available in the Docker container, affecting text rendering in generated images

2. **Large images**: Very large background images may take longer to process inside the container

## 📝 Next Steps

After successful testing:

1. Build the TypeScript for production:
   ```bash
   npm run build
   ```

2. Publish to npm:
   ```bash
   npm publish --access public
   ```

3. Install in your production n8n instance via Community Nodes

---

**Happy Testing! 🎨**

If you encounter any issues, please [open an issue](https://github.com/oriolrius/notion-cover-gen/issues) on GitHub.
