package model;

import java.util.ArrayList;
import java.util.Objects;

public class Graph {

    private ArrayList<Node> nodes;
    private ArrayList<Path> paths;

    public Graph() {
        this.nodes = new ArrayList<>();
        this.paths = new ArrayList<>();
    }

    public ArrayList<Node> getNodes() {
        return nodes;
    }

    public void addNode(Node node) {
        this.nodes.add(node);
    }

    public ArrayList<Path> getPaths() {
        return paths;
    }

    public void addLink(Node source, ArrayList<Node> targets, ArrayList<String> names) {
        for (int i = 0; i < targets.size(); i++) {
            Node node = targets.get(i);
            Path path = findPath(source, node);
            if (path != null) {
                path.addLink(new Link(names.get(i), true, false));
            } else {
                path = findPath(node, source);
                if (path != null) {
                    path.addLink(new Link(names.get(i), false, false));
                } else {
                    Integer indexSource = findNodeIndex(source);
                    if (indexSource != null) {
                        Integer indexNode = findNodeIndex(node);
                        if (indexNode != null) {
                            path = new Path(indexSource, indexNode);
                            path.addLink(new Link(names.get(i), true, false));
                            paths.add(path);
                        }
                    }
                }
            }
        }
    }

    public void addInferredLink(Node source, ArrayList<Node> targets, ArrayList<String> names) {
        for (int i = 0; i < targets.size(); i++) {
            Node node = targets.get(i);
            Path path = findPath(source, node);
            if (path != null) {
                path.addInferredLink(new Link(names.get(i), true, true));
            } else {
                path = findPath(node, source);
                if (path != null) {
                    path.addInferredLink(new Link(names.get(i), false, true));
                } else {
                    Integer indexSource = findNodeIndex(source);
                    if (indexSource != null) {
                        Integer indexNode = findNodeIndex(node);
                        if (indexNode != null) {
                            path = new Path(indexSource, indexNode);
                            path.addLink(new Link(names.get(i), true, true));
                            paths.add(path);
                        }
                    }
                }
            }
        }
    }

    private Path findPath(Node nodeA, Node nodeB) {
        Path path = null;
        for (int i = 0; i < paths.size(); i++) {
            path = paths.get(i);
            if (Objects.equals(findNodeIndex(nodeA), path.getSource())) {
                if (Objects.equals(findNodeIndex(nodeB), path.getTarget())) {
                    return path;
                }
            }
        }
        return null;
    }

    private Integer findNodeIndex(Node node) {
        for (int i = 0; i < nodes.size(); i++) {
            if (node.sameAs(nodes.get(i))) {
                return i;
            }
        }
        return null;
    }

    public void checkPaths() {
        for (Path path : paths) {
            path.checkType();
        }
    }
}
