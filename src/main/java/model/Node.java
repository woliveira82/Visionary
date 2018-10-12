package model;

public class Node {

    private String name;
    private String type;

    public Node(String name, String type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    boolean sameAs(Node target) {
        if (this.name instanceof String) {
            return this.name.equalsIgnoreCase(target.getName());
        }
        return false;
    }

}
