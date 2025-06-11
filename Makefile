# Makefile for convenient project management

# Colors for output
GREEN  := $(shell tput -T xterm setaf 2)
YELLOW := $(shell tput -T xterm setaf 3)
BLUE   := $(shell tput -T xterm setaf 4)
PURPLE := $(shell tput -T xterm setaf 5)
WHITE  := $(shell tput -T xterm setaf 7)
RESET  := $(shell tput -T xterm sgr0)

# Environment variables
export NODE_ENV=development

#Project configuration
PKG_NAME := $(shell cat package.json | jq -r .name)
PKG_VERSION := $(shell cat package.json | jq -r .version)
PKG_MANAGER = bun

.PHONY: help install dev build link format lint clean

.DEFAULT_GOAL := help

help: ## ✨ Show this help message
	@echo "${WHITE}Makefile for ${PURPLE}${PKG_NAME}${RESET} ${WHITE}v${PKG_VERSION}${RESET}"
	@echo 'Current manager: ${BLUE}${PKG_MANAGER}${RESET}'
	@echo ''
	@echo '${WHITE}Usage:${RESET} ${BLUE}'
	@echo 'make${RESET} [${YELLOW}target${RESET}]'
	@echo ''
	@echo '${WHITE}Targets:${RESET}'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${YELLOW}%-15s${RESET} -- %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## 📦 Install dependencies
	@echo "${BLUE}---> 📦 Installing dependencies...${RESET}"
	@bun install
	@echo "${GREEN}📦 Dependencies installed successfully!${RESET}"
	@echo ""

update: ## 🌈 Update dependencies
	@echo "${BLUE}---> 🌈 Updating dependencies...${RESET}"
	@bun add
	@echo "${GREEN}🌈 Dependencies updated successfully!${RESET}"
	@echo ""

reinstall: clean ## 📦 Reinstall dependencies
	@echo "${BLUE}---> 📦 Reinstalling dependencies...${RESET}"
	@bun install
	@echo "${GREEN}📦 Dependencies reinstalled successfully!${RESET}"
	@echo ""

dev: ## 🚀 Start development server with watch mode
	@echo "${BLUE}---> 🚀 Starting development server...${RESET}"
	@bun run dev


build: ## 🏗️ Build the extension for production
	@echo "${BLUE}---> 🏗️ Building extension...${RESET}"
	@bun run build
	@echo "${GREEN}🏗️ Extension built successfully!${RESET}"
	@echo ""

rebuild: reinstall lint format build ## 🏗️ Rebuild the extension

link: ## 🔗 Link the extension to Directus
	@echo "${BLUE}---> 🔗 Linking extension...${RESET}"
	@bun run link
	@echo "${GREEN}🔗 Extension linked successfully!${RESET}"
	@echo ""

format: ## 💅 Format code with Prettier
	@echo "${BLUE}---> 💅 Formatting code...${RESET}"
	@bun run format
	@echo "${GREEN}💅 Code formatted successfully!${RESET}"
	@echo ""

lint: ## 🔍 Lint CSS files with Stylelint
	@echo "${BLUE}---> 🔍 Linting CSS...${RESET}"
	@bun run lint:css
	@echo "${GREEN}🔍 CSS linted successfully!${RESET}"
	@echo ""

clean: ## 🧹 Clean up the project
	@echo "${BLUE}---> 🧹 Cleaning project...${RESET}"
	@rm -rf node_modules dist ${PKG_MANAGER}.lock package-lock.json
	@echo "${GREEN}🧹 Project cleaned successfully!${RESET}"
	@echo ""
