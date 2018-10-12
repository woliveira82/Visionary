package model;

import java.util.ArrayList;

public class Path {

    private Integer source;
    private Integer target;
    private String type;
    private ArrayList<Link> links;

    public Path(Integer source, Integer target) {
        this.source = source;
        this.target = target;
        this.type = "asserted";
        this.links = new ArrayList<>();
    }

    public Integer getSource() {
        return source;
    }

    public void setSource(Integer source) {
        this.source = source;
    }

    public Integer getTarget() {
        return target;
    }

    public void setTarget(Integer target) {
        this.target = target;
    }

    public ArrayList<Link> getLinks() {
        return links;
    }

    public void setLinks(ArrayList<Link> links) {
        this.links = links;
    }

    public void addLink(Link link) {
        this.links.add(link);
    }

    public void addInferredLink(Link newLink) {
        boolean exist = false;
        for (Link link : links) {
            if (newLink.sameAs(link)) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            links.add(newLink);
        }
    }

    public void checkType() {
        String newType = "";
        for (Link link : links) {
            if (link.getInferred()) {
                if (newType.equals("")) {
                    newType = "inferred";
                } else if (newType.equals("asserted")) {
                    newType = "both";
                    break;
                }
            } else if (newType.equals("")) {
                newType = "asserted";
            } else if (newType.equals("inferred")) {
                newType = "both";
                break;
            }
        }
        this.type = newType;
    }
}
