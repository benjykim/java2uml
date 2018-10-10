package com.capstone.converter.umlparser.objects;

public class RelationElement {
    private String from;
    private String to;

    public RelationElement() {
        this.from = null;
        this.to = null;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public void setTo(String to) {
        this.to = to;
    }

}
