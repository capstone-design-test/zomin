package org.zerock.todoserviceproject.application.controller.util;


public class TodoControllerUtil {
    public static boolean isDescendingSorting(String sort) throws Exception {
        boolean desc;

        if ("desc".equalsIgnoreCase(sort)) { desc = true; }
        else if ("asc".equalsIgnoreCase(sort)) { desc = false; }
        else { throw new Exception(); }

        return desc;
    }
}