from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
import json
import os
from math import radians, sin, cos, sqrt, atan2
import heapq

Graph = Dict[str, Dict[str, float]]  # adjacency: node -> {neighbor: weight}

@dataclass
class Node:
    id: str
    lat: float
    lng: float

class RoutingService:
    def __init__(self, data_dir: str):
        self.nodes: Dict[str, Node] = {}
        self.graph: Graph = {}
        self.college_id: str = "college"
        self._load_graph(os.path.join(data_dir, 'campus_graph.json'))

    def _load_graph(self, path: str) -> None:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        # Load nodes
        for n in data['nodes']:
            node = Node(id=n['id'], lat=n['lat'], lng=n['lng'])
            self.nodes[node.id] = node
        # Build adjacency with weights (great-circle distance)
        self.graph = {nid: {} for nid in self.nodes}
        for e in data['edges']:
            a, b = e['from'], e['to']
            d = self.haversine_km(self.nodes[a], self.nodes[b])
            self.graph[a][b] = d
            self.graph[b][a] = d  # assume undirected for simplicity

    @staticmethod
    def haversine_km(a: Node, b: Node) -> float:
        R = 6371.0
        lat1, lon1, lat2, lon2 = map(radians, [a.lat, a.lng, b.lat, b.lng])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        h = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(h), sqrt(1 - h))
        return R * c

    def _nearest_node(self, lat: float, lng: float) -> str:
        tmp_node = Node(id="tmp", lat=lat, lng=lng)
        best_id = None
        best_d = float('inf')
        for nid, node in self.nodes.items():
            d = self.haversine_km(tmp_node, node)
            if d < best_d:
                best_d = d
                best_id = nid
        return best_id  # type: ignore

    def dijkstra(self, start_id: str, end_id: str) -> Tuple[float, List[str]]:
        dist = {nid: float('inf') for nid in self.graph}
        prev: Dict[str, Optional[str]] = {nid: None for nid in self.graph}
        dist[start_id] = 0.0
        pq: List[Tuple[float, str]] = [(0.0, start_id)]
        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            if u == end_id:
                break
            for v, w in self.graph[u].items():
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    prev[v] = u
                    heapq.heappush(pq, (nd, v))
        if dist[end_id] == float('inf'):
            return float('inf'), []
        # Reconstruct
        path: List[str] = []
        cur = end_id
        while cur is not None:
            path.append(cur)
            cur = prev[cur]
        path.reverse()
        return dist[end_id], path

    def shortest_path_to_college(self, start_lat: float, start_lng: float):
        start_node = self._nearest_node(start_lat, start_lng)
        end_node = self.college_id
        total_km, path_ids = self.dijkstra(start_node, end_node)
        coords = [[self.nodes[nid].lat, self.nodes[nid].lng] for nid in path_ids]
        return {
            "start_node": start_node,
            "end_node": end_node,
            "distance_km": round(total_km, 3),
            "nodes": path_ids,
            "path": coords
        }
