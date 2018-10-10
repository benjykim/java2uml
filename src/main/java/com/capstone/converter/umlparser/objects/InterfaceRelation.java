package com.capstone.converter.umlparser.objects;

import java.util.ArrayList;

public class InterfaceRelation {
    private int numOfInterfaces;
    private ArrayList<RelationElement> relations;

    public InterfaceRelation() {
        this.numOfInterfaces = 0;
        this.relations = new ArrayList<>();
    }

    public int getNumOfInterfaces() {
        return numOfInterfaces;
    }

    public RelationElement getRelationElement(int index) {
        return relations.get(index);
    }

    public void setNumOfInterfaces(int numOfInterfaces) {
        this.numOfInterfaces = numOfInterfaces;
    }

    public void addRelationElement(RelationElement element){
        this.relations.add(element);
    }
}
