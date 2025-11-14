#!/bin/bash

# Notion Cover Gen - n8n Docker Test Environment
# Easy script to test the n8n node locally

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create outputs directory if it doesn't exist
mkdir -p n8n-outputs

# Function to display help
show_help() {
    echo -e "${BLUE}Notion Cover Gen - n8n Docker Test Environment${NC}"
    echo ""
    echo "Usage: ./docker-test.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Build and start n8n with the custom node"
    echo "  stop      - Stop the n8n container"
    echo "  restart   - Restart the n8n container"
    echo "  logs      - Show n8n logs"
    echo "  rebuild   - Rebuild the Docker image from scratch"
    echo "  clean     - Stop and remove all containers, images, and volumes"
    echo "  status    - Show container status"
    echo "  help      - Show this help message"
    echo ""
    echo "After starting, access n8n at: http://localhost:5678"
    echo "Login credentials: admin / admin"
}

# Function to start n8n
start_n8n() {
    echo -e "${BLUE}🚀 Starting n8n with Notion Cover Gen node...${NC}"
    echo ""

    # Check if .env file exists, if not create a minimal one
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  No .env file found. Creating one...${NC}"
        echo "FREEPIK_API_KEY=your_key_here" > .env
        echo -e "${YELLOW}   Edit .env to add your Freepik API key if needed.${NC}"
        echo ""
    fi

    # Build and start
    docker-compose up -d --build

    echo ""
    echo -e "${GREEN}✅ n8n is starting up!${NC}"
    echo ""
    echo -e "${BLUE}📍 Access n8n at: ${GREEN}http://localhost:5678${NC}"
    echo -e "${BLUE}👤 Username: ${GREEN}admin${NC}"
    echo -e "${BLUE}🔑 Password: ${GREEN}admin${NC}"
    echo ""
    echo -e "${YELLOW}💡 The custom 'Notion Cover Gen' node should appear in the node list.${NC}"
    echo -e "${YELLOW}   Look for it in the 'Transform' category.${NC}"
    echo ""
    echo -e "Run ${GREEN}./docker-test.sh logs${NC} to view the logs"
    echo -e "Run ${GREEN}./docker-test.sh stop${NC} to stop the container"
}

# Function to stop n8n
stop_n8n() {
    echo -e "${BLUE}🛑 Stopping n8n...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ n8n stopped${NC}"
}

# Function to restart n8n
restart_n8n() {
    echo -e "${BLUE}🔄 Restarting n8n...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ n8n restarted${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Showing n8n logs (Ctrl+C to exit)...${NC}"
    echo ""
    docker-compose logs -f n8n
}

# Function to rebuild
rebuild() {
    echo -e "${BLUE}🔨 Rebuilding Docker image from scratch...${NC}"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo -e "${GREEN}✅ Rebuild complete!${NC}"
}

# Function to clean everything
clean_all() {
    echo -e "${RED}🧹 Cleaning all Docker resources...${NC}"
    read -p "This will remove all containers, images, and volumes. Continue? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        echo -e "${GREEN}✅ All Docker resources cleaned${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    echo ""
    docker-compose ps
}

# Main script logic
case "${1:-help}" in
    start)
        start_n8n
        ;;
    stop)
        stop_n8n
        ;;
    restart)
        restart_n8n
        ;;
    logs)
        show_logs
        ;;
    rebuild)
        rebuild
        ;;
    clean)
        clean_all
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
