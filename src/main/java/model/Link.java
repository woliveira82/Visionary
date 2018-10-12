package model;

public class Link {

    private String name;
    private boolean sense;
    private boolean inferred;

    public Link(String name, boolean sense, boolean inferred) {
        this.name = name;
        this.sense = sense;
        this.inferred = inferred;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    /*
     * Source to Target returns true
     * Target to Source returns false
     */
    public boolean getSense() {
        return sense;
    }

    public void setSense(boolean sense) {
        this.sense = sense;
    }

    public boolean getInferred() {
        return inferred;
    }

    public void setInferred(boolean inferred) {
        this.inferred = inferred;
    }

    public boolean sameAs(Link link) {
        if (!this.name.equals(link.getName())) {
            return false;
        }
        return this.sense == link.getSense();
    }

}
