package dao;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import model.Graph;
import model.Node;
import org.semanticweb.owlapi.model.OWLClassExpression;
import org.semanticweb.owlapi.model.OWLIndividual;
import org.semanticweb.owlapi.model.OWLNamedIndividual;
import org.semanticweb.owlapi.model.OWLObjectPropertyExpression;

public class GraphDAO {

    private static GraphDAO instance = new GraphDAO();
    private Graph graph;

    private GraphDAO() {
        //Asserted Graph
        graph = new Graph();
        //Load All Nodes
        Set<OWLNamedIndividual> individuals = OntologyDAO.getInstance().getAssertedOntology().getIndividualsInSignature();
        for (OWLNamedIndividual individual : individuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getAssertedOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                graph.addNode(new Node(name, type));
            }
        }
        //Load Asserted Links
        for (OWLNamedIndividual individual : individuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getAssertedOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                Node source = new Node(name, type);
                ArrayList<Node> targets = new ArrayList<>();
                ArrayList<String> propertyNames = new ArrayList<>();
                Map<OWLObjectPropertyExpression, Set<OWLIndividual>> individualMap = individual.getObjectPropertyValues(OntologyDAO.getInstance().getAssertedOntology());
                Set<OWLObjectPropertyExpression> propertiesSet = individualMap.keySet();
                for (OWLObjectPropertyExpression property : propertiesSet) {
                    String propertyName = property.toString();
                    propertyName = filterUrl(propertyName);
                    Set<OWLIndividual> individualSet = individualMap.get(property);
                    for (OWLIndividual individualProperty : individualSet) {
                        Set<OWLClassExpression> targetTypes = individualProperty.getTypes(OntologyDAO.getInstance().getAssertedOntology());
                        if (!targetTypes.isEmpty()) {
                            String targetName = individualProperty.asOWLNamedIndividual().getIRI().getFragment();
                            String targetType = targetTypes.toString();
                            targetType = filterUrl(targetType);
                            targets.add(new Node(targetName, targetType));
                            propertyNames.add(propertyName);
                        }
                    }
                }
                if (!targets.isEmpty()) {
                    graph.addLink(source, targets, propertyNames);
                }
            }
        }
        //Load Inferred Links
        for (OWLNamedIndividual individual : individuals) {
            Set<OWLClassExpression> types = individual.getTypes(OntologyDAO.getInstance().getInferredOntology());
            if (!types.isEmpty()) {
                String name = individual.getIRI().getFragment();
                String type = types.toString();
                type = filterUrl(type);
                Node source = new Node(name, type);
                ArrayList<Node> targets = new ArrayList<>();
                ArrayList<String> propertyNames = new ArrayList<>();
                Map<OWLObjectPropertyExpression, Set<OWLIndividual>> individualMap = individual.getObjectPropertyValues(OntologyDAO.getInstance().getInferredOntology());
                Set<OWLObjectPropertyExpression> propertiesSet = individualMap.keySet();
                for (OWLObjectPropertyExpression property : propertiesSet) {
                    String propertyName = property.toString();
                    propertyName = filterUrl(propertyName);
                    Set<OWLIndividual> individualSet = individualMap.get(property);
                    for (OWLIndividual individualProperty : individualSet) {
                        Set<OWLClassExpression> targetTypes = individualProperty.getTypes(OntologyDAO.getInstance().getInferredOntology());
                        if (!targetTypes.isEmpty()) {
                            String targetName = individualProperty.asOWLNamedIndividual().getIRI().getFragment();
                            String targetType = targetTypes.toString();
                            targetType = filterUrl(targetType);
                            if (!targetType.equals("Activity")) {
                                if (targetType.equals("Person") || targetType.equals("Agent") || targetType.equals("Organization") || targetType.equals("SoftwareAgent")) {
                                    targetType = "Agent";
                                } else {
                                    targetType = "Entity";
                                }
                            }
                            targets.add(new Node(targetName, targetType));
                            propertyNames.add(propertyName);
                        }
                    }
                }
                if (!targets.isEmpty()) {
                    graph.addInferredLink(source, targets, propertyNames);
                }
            }
        }
        graph.checkPaths();
    }

    public static GraphDAO getInstance() {
        return instance;
    }

    public Graph readGraph() {
        return graph;
    }

    private String filterUrl(String url) {
        String reply;
        String[] array;
        array = url.split("#");
        if (array.length > 1) {
            reply = array[1];
        } else {
            reply = array[0];
        }
        if (reply.contains(">")) {
            array = reply.split(">");
            reply = array[0];
        } else {
            reply = reply.substring(0, reply.length() - 2);
        }
        return reply;
    }
}
