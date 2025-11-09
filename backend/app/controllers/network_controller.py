from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
import networkx as nx
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
from typing import Dict, List, Tuple
import json

router = APIRouter(prefix="/rider", tags=["Network"])

class PuneNetworkGraph:
    def __init__(self):
        self.G = nx.Graph()
        self.node_positions = {}
        self._create_pune_network()
    
    def _create_pune_network(self):
        """Create a NetworkX graph representing Pune's area network based on real map layout"""
        
        # Define nodes with their approximate positions (normalized coordinates)
        # Based on the uploaded maps, positioning areas according to their real locations
        pune_areas = {
            # North areas (Pimpri-Chinchwad region)
            "Pimpri-Chinchwad": (0.3, 0.9),
            "Akurdi": (0.35, 0.85),
            "Nigdi": (0.32, 0.88),
            "Bhosari": (0.28, 0.87),
            
            # Northeast areas
            "Vishrantwadi": (0.65, 0.8),
            "Viman Nagar": (0.7, 0.75),
            "Kharadi": (0.8, 0.7),
            "Hadapsar": (0.75, 0.6),
            
            # Central areas
            "Pune Station": (0.45, 0.6),
            "Shivajinagar": (0.48, 0.62),
            "Deccan": (0.42, 0.58),
            "Karve Nagar": (0.4, 0.55),
            "Kothrud": (0.35, 0.52),
            "Aundh": (0.38, 0.7),
            "Baner": (0.32, 0.75),
            
            # College and surrounding areas
            "VIIT College": (0.55, 0.45),  # This will be colored red
            "Bibwewadi": (0.52, 0.5),
            "Market Yard": (0.5, 0.52),
            "Swargate": (0.48, 0.48),
            
            # South areas
            "Katraj": (0.45, 0.35),
            "Kondhwa": (0.6, 0.4),
            "Undri": (0.65, 0.35),
            "Handewadi": (0.7, 0.45),
            
            # East areas
            "Koregaon Park": (0.6, 0.65),
            "Kalyani Nagar": (0.65, 0.68),
            "Mundhwa": (0.72, 0.55),
            
            # West areas
            "Warje": (0.25, 0.45),
            "Bavdhan": (0.2, 0.5),
            "Pashan": (0.22, 0.65),
        }
        
        # Add nodes to the graph
        for area, position in pune_areas.items():
            self.G.add_node(area)
            self.node_positions[area] = position
        
        # Define edges based on real connectivity between areas
        connections = [
            # North region connections
            ("Pimpri-Chinchwad", "Akurdi"),
            ("Pimpri-Chinchwad", "Nigdi"),
            ("Akurdi", "Nigdi"),
            ("Nigdi", "Bhosari"),
            ("Akurdi", "Aundh"),
            
            # Northeast connections
            ("Vishrantwadi", "Viman Nagar"),
            ("Viman Nagar", "Kharadi"),
            ("Kharadi", "Hadapsar"),
            ("Viman Nagar", "Koregaon Park"),
            ("Koregaon Park", "Kalyani Nagar"),
            ("Kalyani Nagar", "Mundhwa"),
            ("Mundhwa", "Hadapsar"),
            
            # Central hub connections
            ("Aundh", "Baner"),
            ("Aundh", "Shivajinagar"),
            ("Baner", "Pashan"),
            ("Pashan", "Bavdhan"),
            ("Shivajinagar", "Pune Station"),
            ("Pune Station", "Deccan"),
            ("Deccan", "Karve Nagar"),
            ("Karve Nagar", "Kothrud"),
            ("Kothrud", "Warje"),
            ("Warje", "Bavdhan"),
            
            # Central to college area
            ("Pune Station", "Swargate"),
            ("Swargate", "Market Yard"),
            ("Market Yard", "Bibwewadi"),
            ("Bibwewadi", "VIIT College"),
            ("Swargate", "VIIT College"),
            
            # South connections
            ("VIIT College", "Kondhwa"),
            ("Kondhwa", "Undri"),
            ("Kondhwa", "Katraj"),
            ("Katraj", "Warje"),
            ("Undri", "Handewadi"),
            ("Handewadi", "Mundhwa"),
            
            # Cross connections
            ("Shivajinagar", "Koregaon Park"),
            ("Deccan", "Swargate"),
            ("Hadapsar", "Handewadi"),
            ("VIIT College", "Hadapsar"),
            ("Market Yard", "Kondhwa"),
        ]
        
        # Add edges to the graph
        for connection in connections:
            self.G.add_edge(connection[0], connection[1])
    
    def generate_graph_image(self) -> bytes:
        """Generate a clean and fresh visualization of the Pune network graph"""
        
        # Create figure with larger size for better visibility
        plt.figure(figsize=(16, 12))
        plt.clf()
        
        # Set up the plot with a clean background
        fig, ax = plt.subplots(figsize=(16, 12))
        ax.set_facecolor('#f8f9fa')  # Light gray background
        
        # Define colors for different types of nodes
        node_colors = []
        node_sizes = []
        
        for node in self.G.nodes():
            if node == "VIIT College":
                node_colors.append('#dc3545')  # Red for VIIT College
                node_sizes.append(1200)  # Larger size for destination
            elif node in ["Pune Station", "Swargate", "Shivajinagar"]:
                node_colors.append('#007bff')  # Blue for major hubs
                node_sizes.append(800)
            else:
                node_colors.append('#28a745')  # Green for regular areas
                node_sizes.append(600)
        
        # Draw the network
        nx.draw_networkx_nodes(
            self.G, 
            pos=self.node_positions,
            node_color=node_colors,
            node_size=node_sizes,
            alpha=0.8,
            edgecolors='white',
            linewidths=2
        )
        
        # Draw edges with a clean style
        nx.draw_networkx_edges(
            self.G,
            pos=self.node_positions,
            edge_color='#6c757d',
            width=2,
            alpha=0.6,
            style='-'
        )
        
        # Draw labels with better formatting
        labels = {node: node.replace(" ", "\n") for node in self.G.nodes()}
        nx.draw_networkx_labels(
            self.G,
            pos=self.node_positions,
            labels=labels,
            font_size=9,
            font_weight='bold',
            font_color='#212529',
            bbox=dict(boxstyle="round,pad=0.3", facecolor='white', alpha=0.8, edgecolor='none')
        )
        
        # Add title and styling
        plt.title("Pune Area Network Map\nRide Sharing Routes", 
                 fontsize=20, fontweight='bold', pad=20, color='#212529')
        
        # Add legend
        legend_elements = [
            plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='#dc3545', 
                      markersize=15, label='VIIT College (Destination)', markeredgecolor='white', markeredgewidth=2),
            plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='#007bff', 
                      markersize=12, label='Major Hubs', markeredgecolor='white', markeredgewidth=2),
            plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='#28a745', 
                      markersize=10, label='Residential Areas', markeredgecolor='white', markeredgewidth=2),
        ]
        
        plt.legend(handles=legend_elements, loc='upper left', fontsize=12, 
                  frameon=True, fancybox=True, shadow=True)
        
        # Remove axes and set equal aspect ratio
        ax.set_aspect('equal')
        ax.axis('off')
        
        # Adjust layout
        plt.tight_layout()
        
        # Save to bytes
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer.getvalue()
    
    def get_graph_data(self) -> Dict:
        """Get graph data as JSON for frontend processing"""
        nodes = []
        edges = []
        
        for node in self.G.nodes():
            pos = self.node_positions[node]
            if node == "VIIT College":
                color = "#dc3545"  # Red for VIIT College
                size = 30
            elif node in ["Pune Station", "Swargate", "Shivajinagar"]:
                color = "#007bff"  # Blue for major hubs
                size = 25
            else:
                color = "#28a745"  # Green for regular areas
                size = 20
                
            nodes.append({
                "id": node,
                "label": node,
                "x": pos[0],
                "y": pos[1],
                "color": color,
                "size": size
            })
        
        for edge in self.G.edges():
            edges.append({
                "from": edge[0],
                "to": edge[1]
            })
        
        return {
            "nodes": nodes,
            "edges": edges,
            "total_nodes": len(nodes),
            "total_edges": len(edges)
        }

# Global instance
pune_network = PuneNetworkGraph()

@router.get("/network")
async def get_pune_network_graph():
    """Get Pune area network graph as image"""
    try:
        image_bytes = pune_network.generate_graph_image()
        return StreamingResponse(
            io.BytesIO(image_bytes),
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=pune_network.png"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating graph: {str(e)}")

@router.get("/network/data")
async def get_pune_network_data():
    """Get Pune area network graph data as JSON"""
    try:
        return pune_network.get_graph_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting graph data: {str(e)}")

@router.get("/network/info")
async def get_network_info():
    """Get basic information about the Pune network"""
    try:
        graph_data = pune_network.get_graph_data()
        return {
            "message": "Pune Area Network Map for Ride Sharing",
            "total_areas": graph_data["total_nodes"],
            "total_connections": graph_data["total_edges"],
            "destination": "VIIT College",
            "coverage": "25+ major areas in Pune",
            "features": [
                "Real map-based connectivity",
                "VIIT College highlighted as destination", 
                "Major transportation hubs identified",
                "Optimized for ride-sharing routes"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting network info: {str(e)}")