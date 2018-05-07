<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Config\Definition\Exception\Exception;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request) {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->render('default/index.html.twig');
        }

        $user = $this->getUser();
        $answeredQuestions = $user->getAnsweredQuestions();

        $firstUser = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(array(), array('score' => 'DESC'), 1);

        return $this->render('default/dashboard.html.twig', array(
            'answeredQuestions' => $answeredQuestions,
            'isFirstUser' => $firstUser[0]->getId() == $user->getId()
        ));
    }

    /**
     * @Route("/share", name="share")
     */
    public function shareAction(Request $request) {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->render('default/index.html.twig');
        }

        $emailsToShare = $request->request->all();
        $user = $this->getUser();

        $recipients = array();
        foreach ($emailsToShare as $email) {
            if ($email != '')
                array_push($recipients, $email);
        }

        // Send Share Email(s)
        $message = (new \Swift_Message('¡Has sido convocado a la Ruleta Mundialista Colsubsidio!'))
            ->setFrom('francisco.acendra@gmail.com')
            ->setTo($recipients)
            ->setBody(
                $this->renderView(
                    'Emails/share.html.twig',
                    array('user' => $user)
                ),
                'text/html'
            )
        ;
        $this->get('mailer')->send($message);

        return $this->redirectToRoute('homepage');
    }

    /**
     * @Route("/userInfo", name="userInfo")
     */
    public function userInfoAction(Request $request) {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->render('default/index.html.twig');
        }

        if ($request->isXmlHttpRequest()) {
            $user = $this->getUser();

            $answeredQuestions = $user->getAnsweredQuestions();
            $lastLogin = $user->getLastLogin();
            $userInfo = array('answeredQuestions' => $answeredQuestions, 'lastLogin' => $lastLogin);

            return new Response(
                json_encode($userInfo)
            , 200);
        }

        throw new Exception("Error; la petición debe ser XmlHttp", 1);
    }

    /**
     * @Route("/saveAnswer", name="saveAnswer")
     */
    public function saveAnswerAction(Request $request) {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->render('default/index.html.twig');
        }

        if ($request->isXmlHttpRequest()) {
            $correctAnswer = $request->request->get('correctAnswer');
            $user = $this->getUser();
            $status = 'free';

            $em = $this->getDoctrine()->getManager();

            $user->setAnsweredQuestions($user->getAnsweredQuestions() + 1);

            if ($correctAnswer == 'true') {
                $user->setScore($user->getScore() + 10);
            }

            $em->persist($user);
            $em->flush();

            if ($user->getAnsweredQuestions() > 2) {
                $status = 'block';
            }

            return new Response(
                json_encode(array('status' => $status, 'score' => $user->getScore()))
            , 200);
        }

        throw new Exception("Error; la petición debe ser XmlHttp", 1);
    }

    /**
     * @Route("/randomQuestion", name="randomQuestion")
     */
    public function randomQuestionAction(Request $request) {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->render('default/index.html.twig');
        }

        if ($request->isXmlHttpRequest()) {
            $randomId = rand(0, 29);

            $repo = $this->getDoctrine()->getRepository('AppBundle:Question');
            $randomQuestion = $repo->createQueryBuilder('q')
                        ->where('q.id=:randomId')
                        ->setParameter('randomId', $randomId)
                        ->getQuery()
                        ->getArrayResult();

            return new Response(
                json_encode($randomQuestion)
            , 200);
        }

        throw new Exception("Error; la petición debe ser XmlHttp", 1);
    }

    /**
     * @Route("/ranking", name="ranking")
     */
    public function rankingAction(Request $request) {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->render('default/index.html.twig');
        }

        if ($request->isXmlHttpRequest()) {
            $totalUsers = $this->getDoctrine()->getRepository('AppBundle:User')->findAll();
            $users = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(array(), array('score' => 'DESC', 'id' => 'ASC'), 10);
            $usersArray = [];

            foreach ($users as $user) {
                array_push($usersArray, array(
                    'name' => $user->getName() . ' ' . $user->getLastName(),
                    'score' => $user->getScore(),
                    'id' => $user->getId(),
                    'totalUsers' => count($totalUsers)
                ));
            }

            return new Response(
                json_encode($usersArray)
            , 200);
        }

        throw new Exception("Error; la petición debe ser XmlHttp", 1);
    }
}
