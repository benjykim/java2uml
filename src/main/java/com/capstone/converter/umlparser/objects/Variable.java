package com.capstone.converter.umlparser.objects;

public class Variable {
    private String name;
    private String type;
    private String accessModifier;

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getAccessModifier() {
        return accessModifier;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setAccessModifier(String accessModifier) {
        this.accessModifier = accessModifier;
    }
}
