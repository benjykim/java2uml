package com.capstone.converter.umlparser.objects;

import java.util.ArrayList;

public class InheritanceRelation {
    private int numOfInheritances;
    private ArrayList<RelationElement> relations;

    public InheritanceRelation() {
        this.numOfInheritances = 0;
        this.relations = new ArrayList<>();
    }

    public int getNumOfInheritances() {
        return numOfInheritances;
    }

    public RelationElement getRelationElement(int index) {
        return relations.get(index);
    }

    public void setNumOfInheritances(int numOfInheritances) {
        this.numOfInheritances = numOfInheritances;
    }

    public void addRelationElement(RelationElement element){
        this.relations.add(element);
    }
}
