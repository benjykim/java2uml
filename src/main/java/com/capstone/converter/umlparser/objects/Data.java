package com.capstone.converter.umlparser.objects;

import java.util.ArrayList;

public class Data {
    private int numOfClasses;
    private int numOfInterfaces;
    private ArrayList<Class> classes;
    private ArrayList<Interface> interfaces;
    private InheritanceRelation inheritanceRelation;
    private InterfaceRelation interfaceRelation;

    public Data() {
        this.numOfClasses = 0;
        this.numOfInterfaces = 0;
        this.classes = new ArrayList<>();
        this.interfaces = new ArrayList<>();
        this.inheritanceRelation = new InheritanceRelation();
        this.interfaceRelation = new InterfaceRelation();
    }

    public int getNumOfClasses() {
        return numOfClasses;
    }

    public int getNumOfInterfaces() {
        return numOfInterfaces;
    }

    public Class getClass(int index){
        return classes.get(index);
    }

    public Interface getInterface(int index){
        return interfaces.get(index);
    }

    public InheritanceRelation getInheritanceRelation() {
        return inheritanceRelation;
    }

    public InterfaceRelation getInterfaceRelation() {
        return interfaceRelation;
    }

    public void setNumOfClasses(int numOfClasses) {
        this.numOfClasses = numOfClasses;
    }

    public void setNumOfInterfaces(int numOfInterfaces) {
        this.numOfInterfaces = numOfInterfaces;
    }

    public void setInheritanceRelation() {
        this.inheritanceRelation = new InheritanceRelation();
    }

    public void setInterfaceRelation() {
        this.interfaceRelation = new InterfaceRelation();
    }

    public void addClass(Class clazz){
        classes.add(clazz);
    }

    public void addInterface(Interface interfacz) {
        interfaces.add(interfacz);
    }
}
