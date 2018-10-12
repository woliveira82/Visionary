package action;

import com.google.gson.Gson;
import controller.Action;
import dao.GraphDAO;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Graph;

public class ReadGraphAction extends Action{

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        Graph graph = GraphDAO.getInstance().readGraph();
        Gson gson = new Gson();
        String json = gson.toJson(graph);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().write(json);
        } catch (IOException ex) {
            Logger.getLogger(ReadGraphAction.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
