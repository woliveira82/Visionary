package action;

import controller.Action;
import dao.OntologyDAO;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ReadOWLPathAction extends Action {

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        String reply = OntologyDAO.getInstance().getAssertedFile();
        String[] replyPath = reply.split("/");
        reply = replyPath[replyPath.length - 1];

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().write(reply);
        } catch (IOException ex) {
            Logger.getLogger(ReadOWLPathAction.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

}
