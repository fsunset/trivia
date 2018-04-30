<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Question
 *
 * @ORM\Table(name="question")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\QuestionRepository")
 */
class Question
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=1000)
     */
    protected $title;

    /**
     * @var string
     *
     * @ORM\Column(name="firstOption", type="string", length=255)
     */
    protected $firstOption;

    /**
     * @var string
     *
     * @ORM\Column(name="secondOption", type="string", length=255)
     */
    protected $secondOption;

    /**
     * @var string
     *
     * @ORM\Column(name="thirdOption", type="string", length=255)
     */
    protected $thirdOption;

    /**
     * @var string
     *
     * @ORM\Column(name="answer", type="string", length=255)
     */
    protected $answer;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Question
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set firstOption
     *
     * @param string $firstOption
     *
     * @return Question
     */
    public function setFirstOption($firstOption)
    {
        $this->firstOption = $firstOption;

        return $this;
    }

    /**
     * Get firstOption
     *
     * @return string
     */
    public function getFirstOption()
    {
        return $this->firstOption;
    }

    /**
     * Set secondOption
     *
     * @param string $secondOption
     *
     * @return Question
     */
    public function setSecondOption($secondOption)
    {
        $this->secondOption = $secondOption;

        return $this;
    }

    /**
     * Get secondOption
     *
     * @return string
     */
    public function getSecondOption()
    {
        return $this->secondOption;
    }

    /**
     * Set thirdOption
     *
     * @param string $thirdOption
     *
     * @return Question
     */
    public function setThirdOption($thirdOption)
    {
        $this->thirdOption = $thirdOption;

        return $this;
    }

    /**
     * Get thirdOption
     *
     * @return string
     */
    public function getThirdOption()
    {
        return $this->thirdOption;
    }

    /**
     * Set answer
     *
     * @param string $answer
     *
     * @return Question
     */
    public function setAnswer($answer)
    {
        $this->answer = $answer;

        return $this;
    }

    /**
     * Get answer
     *
     * @return string
     */
    public function getAnswer()
    {
        return $this->answer;
    }
}

