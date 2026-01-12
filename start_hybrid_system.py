#!/usr/bin/env python3
"""
Ultimate Simple Hybrid System - No Dependencies
"""

import json
import subprocess
import time
import os

def check_ollama():
    """Check if Ollama is running"""
    try:
        result = subprocess.run(
            ["curl", "http://localhost:11434/api/tags"],
            timeout=5
        )
        return result.returncode == 200
    except:
        return False

def download_models():
    """Download required models"""
    models = ["qwen2:1.5b", "tinyllama"]
    
    for model in models:
        print(f"Downloading {model}...")
        subprocess.run([
            "ollama", "pull", model
        ], timeout=300)
    
    print(f"✅ Models downloaded!")

def check_services():
    """Check all services status"""
    print("\n🔍 Checking services...")
    
    # Check Docker
    try:
        docker_result = subprocess.run([
            "docker", "compose", "-f", "docker-compose.simple.yml", "ps"], 
            capture_output=True, text=True
            timeout=10
        ])
        docker_running = "Up" in docker_result.stdout
        
        print(f"   Docker: {'✅' if docker_running else '❌'} Docker services: {docker_running}")
        
        # Check Kestra
        try:
            kestra_result = subprocess.run([
                ["curl", "-s", "http://localhost:8081"], timeout=5)
                ])
            kestra_running = "Up" in kestra_result.returncode == 200
            print(f"   Kestra: {'✅' if kestra_running else '❌'} Kestra service: {kestra_running}")
        
        # Check Ollama
        ollama_running = check_ollama()
        print(f"   Ollama: {'✅' if ollama_running else '❌'} Ollama service: {ollama_running}")
        
        return docker_running and kestra_running and ollama_running

def start_system():
    """Start all services"""
    print("🚀 Starting CandidateAI Hybrid System...")
    
    # Start Docker
    subprocess.run([
        "docker-compose", "-f", "docker-compose.simple.yml", "up", "-d"], timeout=30)
    
    # Wait for services to start
    time.sleep(10)
    check_services()
    
    def main():
    """Main entry point"""
    print("🚀 CandidateAI - Hybrid AI System")
    print("="*60)
    
    # 1. Install Ollama (user runs)
    print("\n📥 Step 1: Install Ollama")
    if not check_ollama():
        print("   💡 Installing Ollama...")
        download_models()
        if check_ollama():
            print("   ✅ Ollama is running!")
        else:
            print("   📥 Run: ollama serve")
            subprocess.Popen(["ollama", "serve"], creationflags=subprocess.CREATE_NEW_PROCESS)
            print("   📩 Ollama should start in a new terminal")
    
    # 2. Check system
    services_up = check_services()
    
    if services_up:
        print("✅ All services running! System is ready!")
        print("\n🚀 ACCESS POINTS:")
        print("   🔗 Kestra Dashboard: http://localhost:8081")
        print("   🤖 API Server: http://localhost:3000") 
        print("   � Ollama Models: http://localhost:11434")
        print("\n📊 Upload Interface: http://localhost:3000")
        
        # Keep checking status
        while services_up:
            time.sleep(30)
            check_services()
        
    if __name__ == "__main__":
        main()

if __name__ == "__main__":
    main()