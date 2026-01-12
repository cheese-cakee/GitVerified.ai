"""
Ultra-Lightweight API Server - No Dependencies
Connects Frontend to Kestra + Ollama
"""

import json
import subprocess
import threading
import time
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

class CandidateAIAPI(BaseHTTPRequestHandler):
    """Ultra-lightweight API handler"""

class CandidateAIAPI(BaseHTTPRequestHandler):
    """Ultra-lightweight API handler"""
    
    def do_OPTIONS(self):
        self.send_response(200, b"OK", [("Access-Control-Allow-Origin", b"*")])
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        # Simple CORS headers
        self.send_response(200, b"OK", [
            ("Access-Control-Allow-Origin", b"*"),
            ("Access-Control-Allow-Methods", b"GET, POST, OPTIONS"),
            ("Access-Control-Allow-Headers", b"Content-Type")
        ])
        
        # Handle endpoints
        if self.path == '/api/evaluate':
            return self.handle_evaluate(post_data)
        elif self.path == '/api/flows':
            return self.handle_flows()
        elif self.path == '/api/flow/execute':
            return self.handle_flow_execute(post_data)
        elif self.path == '/api/models/status':
            return self.handle_models_status()
        elif self.path == '/api/ollama/test':
            return self.handle_ollama_test(post_data)
        else:
            self.send_error(404, b"Endpoint not found")
    
    def do_GET(self):
        if self.path == '/api/flows':
            return self.handle_flows()
        elif self.path == '/api/models/status':
            return self.handle_models_status()
        elif self.path == '/api/ollama/test':
            return self.handle_ollama_test()
        else:
            self.send_response(200, b"CandidateAI API Server", [
                ("Content-Type", b"text/html")
            ])
            self.wfile.write(b'''
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>CandidateAI API</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                        .endpoint { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .method { color: #2563eb; font-weight: bold; }
                        .url { color: #6b7280; word-break: break-all; }
                    </style>
                </head>
                <body>
                    <h1>CandidateAI API Server</h1>
                    <p>Server is running! Available endpoints:</p>
                    
                    <div class="endpoint">
                        <h3><span class="method">GET</span> /api/flows</h3>
                        <p>List all available Kestra flows</p>
                    </div>
                    
                    <div class="endpoint">
                        <h3><span class="method">POST</span> /api/evaluate</h3>
                        <p>Trigger evaluation (JSON form data)</p>
                    </div>
                    
                    <div class="endpoint">
                        <h3><span class="method">GET</span> /api/models/status</h3>
                        <p>Check if Ollama is running</p>
                    </div>
                    
                    <div class="endpoint">
                        <h3><span class="method">POST</span> /api/flow/execute</h3>
                        <p>Execute specific flow</p>
                    </div>
                    
                    <div class="endpoint">
                        <h3><span class="method">POST</span> /api/ollama/test</h3>
                        <p>Test Ollama model directly</p>
                    </div>
                </body>
                </html>
            ''')
    
    def send_json(self, data):
        self.send_response(200, json.dumps(data), [
            ("Access-Control-Allow-Origin", b"*"),
            ("Content-Type", b"application/json")
        ])
    
    def send_error(self, code, message):
        self.send_response(code, message, [
            ("Access-Control-Allow-Origin", b"*"),
            ("Content-Type", b"application/json")
        ])
    
    def handle_evaluate(self, post_data):
        """Handle evaluation request"""
        try:
            data = parse_qs(post_data.decode('utf-8'))
            
            resume_path = data.get(b'resume_path', [b''])[0].decode('utf-8')
            job_description = data.get(b'job_description', [b''])[0].decode('utf-8')
            github_url = data.get(b'github_url', [b''])[0].decode('utf-8')
            leetcode_username = data.get(b'leetcode_username', [b''])[0].decode('utf-8')
            use_ai = data.get(b'use_ai', [b'true'])[0].decode('utf-8').lower() == b'true'
            
            # Trigger Kestra flow
            flow_id = self.trigger_kestra_flow(
                resume_path=resume_path,
                job_description=job_description,
                github_url=github_url,
                leetcode_username=leetcode_username,
                use_ai=use_ai
            )
            
            if flow_id:
                return self.send_json({
                    b"status": b"started",
                    b"flow_id": flow_id,
                    b"message": b"Evaluation started via Kestra"
                })
            else:
                return self.send_error(500, b"Failed to trigger evaluation")
                
        except Exception as e:
            return self.send_error(500, str(e).encode())
    
    def handle_flows(self):
        """Get available flows"""
        try:
            flows = self.get_kestra_flows()
            return self.send_json({b"flows": json.dumps(flows)})
        except Exception as e:
            return self.send_error(500, str(e).encode())
    
    def handle_flow_execute(self, post_data):
        """Execute a specific flow"""
        try:
            data = parse_qs(post_data.decode('utf-8'))
            flow_id = data.get(b'flow_id', [b''])[0].decode('utf-8')
            inputs = data.get(b'inputs', [b''])[0].decode('utf-8')
            
            if not flow_id or not inputs:
                return self.send_error(400, b"Flow ID and inputs required")
            
            try:
                inputs = json.loads(inputs)
            except:
                return self.send_error(400, b"Invalid inputs JSON")
            
            result = self.execute_kestra_flow(flow_id, inputs)
            return self.send_json(result)
                
        except Exception as e:
            return self.send_error(500, str(e).encode())
    
    def handle_models_status(self):
        """Check Ollama model status"""
        try:
            response = subprocess.check_output([
                b'curl', b'-s', b'http://localhost:11434/api/tags',
                b'-w', b'--max-time', b'5'
                b'-f', b'/dev/null'
            ], timeout=10)
            
            ollama_running = b'"models":' in response
            
            models = []
            if ollama_running:
                # Parse available models
                model_list_start = response.find(b'"models": [')
                if model_list_start != -1:
                    model_list_end = response.find(b']', model_list_start)
                    models_text = response[model_list_start:model_list_end]
                    try:
                        models = json.loads(models_text)
                    except:
                        models = []
            
            return self.send_json({
                b"status": b"success",
                b"ollama_running": ollama_running,
                b"models": models
            })
            
        except Exception as e:
            return self.send_error(500, str(e).encode())
    
    def handle_ollama_test(self, post_data):
        """Test Ollama model directly"""
        try:
            data = parse_qs(post_data.decode('utf-8'))
            prompt = data.get(b'prompt', [b''])[0].decode('utf-8')
            model = data.get(b'model', [b'qwen2:1.5b'])[0].decode('utf-8')
            
            response = subprocess.check_output([
                b'curl', b'-s', b'http://localhost:11434/api/generate',
                b'-X', b'POST', b'-H', b'Content-Type: application/json',
                b'-d', json.dumps({
                    b"model": model,
                    b"prompt": prompt,
                    b"stream": False,
                    b"options": json.dumps({
                        b"temperature": 0.3,
                        b"num_predict": 200
                    })
                }),
                b'-w', b'/dev/null',
                b'-f', b'/dev/null'
            ], timeout=10)
            
            if b'"response":' in response:
                result = json.loads(response.decode('utf-8').split(b'"response":')[1].split(b'}')[0] + b'}')
                return self.send_json({
                    b"status": b"success",
                    b"model": model,
                    b"response": result.get(b'response', b''),
                    b"message": b"Ollama test successful"
                })
            else:
                return self.send_error(500, b"Ollama test failed")
                
        except Exception as e:
            return self.send_error(500, str(e).encode())
    
    def trigger_kestra_flow(self, resume_path, job_description, github_url, leetcode_username, use_ai):
        """Trigger Kestra flow execution"""
        cmd = [
            b'curl', b'-X', b'POST',
            b'http://localhost:8081/api/v1/flows/candidate-evaluation-enhanced/execute',
            b'-H', b'Content-Type: application/json',
            b'-d', json.dumps({
                b"inputs": {
                    b"resume_path": resume_path,
                    b"job_description": job_description,
                    b"github_url": github_url,
                    b"leetcode_username": leetcode_username,
                    b"use_ai_models": use_ai
                }
            })
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            # Extract flow ID
            output = result.stdout
            for line in output.split('\n'):
                if '"id":"' in line:
                    return line.split('"id":')[1].split('"')[0]
        
        return result.returncode == 0 and output.strip() else None
    
    def execute_kestra_flow(self, flow_id, inputs):
        """Execute Kestra flow and get results"""
        cmd = [
            b'curl', b'-s', b'http://localhost:8081/api/v1/executions',
            b'-H', b'Content-Type: application/json',
            b'-f', f'{{"flowId": "{flow_id}"}}',
            b'-w', b'/dev/null'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        return result.returncode == 0
    
    def wait_for_execution_results(self, execution_id, inputs):
        """Wait for flow to complete"""
        max_wait = 120  # 2 minutes
        wait_time = 2
        
        for i in range(max_wait // wait_time):
            time.sleep(wait_time)
            
            try:
                cmd = [
                    b'curl', b'-s', f'http://localhost:8081/api/v1/executions/{execution_id}',
                    b'-H', b'Content-Type: application/json',
                    b'-f', f'{{"include": ["tasks"]}}'
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
                
                if result.returncode == 0:
                    exec_data = json.loads(result.stdout)
                    
                    # Check if execution is complete
                    state = exec_data.get('state', '')
                    if state in ['SUCCESS', 'FAILED', 'WARNING', 'CREATED']:
                        # Get task outputs
                        base_path = inputs.get('resume_path', '').replace('.pdf', '')
                        
                        task_outputs = {}
                        for task in exec_data.get('tasks', []):
                            task_id = task.get('id')
                            task_name = task.get('task', {}).get('task', '')
                            task_state = task.get('state', '')
                            
                            if task_state == 'SUCCESS':
                                outputs = self.get_task_outputs(task_id)
                                task_outputs[task_name] = outputs
                        
                        # If all tasks complete, compile results
                        if all(task.get('state', '') in ['SUCCESS'] for task in exec_data.get('tasks', [])):
                            return self.generate_final_result(task_outputs, inputs)
                    
                continue
                
            except Exception as e:
                print(f"Error checking execution status: {e}")
        
        return {"status": "error", "message": str(e)}
    
    def get_task_outputs(self, task_id):
        """Get outputs from a specific task"""
        try:
            cmd = [
                b'curl', b'-s', f'http://localhost:8081/api/v1/tasks/{task_id}/outputs',
                b'-H', b'Content-Type: application/json',
                b'-f', f'{{"include": ["outputs"]}}'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                outputs = json.loads(result.stdout)
                return outputs.get('outputs', {})
            else:
                return {}
                
        except Exception as e:
            print(f"Error getting task outputs: {e}")
            return {}
    
    def get_kestra_flows(self):
        """Get available flows from Kestra"""
        try:
            cmd = [
                b'curl', b'-s', b'http://localhost:8081/api/v1/flows',
                b'-H', b'Content-Type: application/json'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                flows_data = json.loads(result.stdout)
                return flows_data.get('flows', [])
            else:
                return []
                
        except Exception as e:
            print(f"Error getting flows: {e}")
            return []
    
    def generate_final_result(self, task_outputs, inputs):
        """Generate final evaluation result"""
        try:
            # Extract scores with defaults
            integrity_score = task_outputs.get('integrity', {}).get('score', 0)
            quality_score = task_outputs.get('code_quality', {}).get('score', 50) / 10  # Convert to 0-10 scale
            uniqueness_score = task_outputs.get('uniqueness', {}).get('score', 5)
            relevance_score = task_outputs.get('relevance', {}).get('score', 5)
            
            # Weighted scoring
            weights = {"integrity": 0.20, "quality": 0.30, "uniqueness": 0.30, "relevance": 0.20}
            
            overall_score = (
                integrity_score * weights["integrity"] +
                quality_score * weights["quality"] +
                uniqueness_score * weights["uniqueness"] +
                relevance_score * weights["relevance"]
            )
            
            # Generate recommendation
            if overall_score >= 7.0 and integrity_score >= 6.0:
                recommendation = "PASS"
                reasoning = f"Strong candidate with overall score of {overall_score:.1f}/10"
            elif overall_score >= 5.0 and integrity_score >= 4.0:
                recommendation = "WAITLIST"
                reasoning = f"Potential candidate with overall score of {overall_score:.1f}/10"
            else:
                recommendation = "REJECT"
                reasoning = f"Does not meet standards with overall score of {overall_score:.1f}/10"
            
            return {
                "overall_score": round(overall_score, 1),
                "recommendation": recommendation,
                "reasoning": reasoning,
                "score_breakdown": {
                    "integrity": integrity_score,
                    "code_quality": quality_score,
                    "uniqueness": uniqueness_score,
                    "relevance": relevance_score
                }
            }
            
        except Exception as e:
            return {
                "overall_score": 0,
                "recommendation": "ERROR",
                "reasoning": str(e)
            }

def run_server(port=3000, max_threads=50):
    """Run the API server"""
    server = HTTPServer(('localhost', port), CandidateAIAPI)
    
    # Try to bind the port
    try:
        server.serve_forever(poll_interval=1)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        print(f"❌ Error: Could not bind to port {port}: {e}")
        print(f"🔧 Try a different port: python {sys.argv[0]} {port+1}")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == '__main__':
    print("🚀 CandidateAI API Server Starting...")
    print("📊 Server will run on port 3000")
    print("🔧 Frontend should connect to: http://localhost:3000")
    print("🔗 Kestra runs on: http://localhost:8081")
    print("🤖 Ollama runs on: http://localhost:11434")
    
    # Start server
    run_server()