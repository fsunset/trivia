<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $user = $this->getUser();

        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/ranking", name="ranking")
     */
    public function rankingAction(Request $request)
    {
        if ($request->isXmlHttpRequest()) {
            $users = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(array(), array('score' => 'DESC', 'id' => 'DESC'));
            $usersArray = [];

            foreach ($users as $user) {
                array_push($usersArray, array(
                    'name' => $user->getName() . ' ' . $user->getLastName(),
                    'score' => $user->getScore()
                ));
            }

            return new Response(
                json_encode($usersArray)
            , 200);
        }

        throw new Exception("Error; la petición debe ser XmlHttp", 1);
    }

    /**
     * @Route("/terms", name="terms")
     */
    public function termsAction(Request $request)
    {
        return $this->render('default/terms.html.twig');
    }
}
