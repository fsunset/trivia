<?php

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 */
class User extends BaseUser {
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @Assert\NotBlank(message="Por favor, indícanos tu nombre.", groups={"Registration", "Profile"})
     */
    protected $name;

    /**
     * @var string
     *
     * @ORM\Column(name="lastName", type="string", length=255)
     * @Assert\NotBlank(message="Por favor, indícanos tus apellidos.", groups={"Registration", "Profile"})
     */
    protected $lastName;

    /**
     * @var string
     *
     * @ORM\Column(name="mobile", type="string", length=15)
     * @Assert\NotBlank(message="Por favor, indícanos tu teléfono.", groups={"Registration", "Profile"})
     */
    protected $mobile;

    /**
     * @var string
     *
     * @ORM\Column(name="bill", type="string", length=15)
     * @Assert\NotBlank(message="Por favor, indícanos tu número de factura.", groups={"Registration"})
     */
    protected $bill;

    /**
     * @var bool
     *
     * @ORM\Column(name="isAssociated", type="boolean", options={"default":"0"})
     */
    protected $isAssociated;

    /**
     * @var bool
     *
     * @ORM\Column(name="acceptedTerms", type="boolean", options={"default":"0"})
     */
    protected $acceptedTerms;

    /**
     * @var integer
     *
     * @ORM\Column(name="score", type="integer")
     */
    protected $score = 5;


    public function __construct() {
        parent::__construct();
        // your own logic
    }

    /**
     * Set the value of name.
     *
     * @param string $name
     * @return \AppBundle\Entity\User
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get the value of name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set the value of lastName.
     *
     * @param string $lastName
     * @return \AppBundle\Entity\User
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get the value of lastName.
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set the value of mobile.
     *
     * @param string $mobile
     * @return \AppBundle\Entity\User
     */
    public function setMobile($mobile)
    {
        $this->mobile = $mobile;

        return $this;
    }

    /**
     * Get the value of mobile.
     *
     * @return string
     */
    public function getMobile()
    {
        return $this->mobile;
    }

    /**
     * Set the value of bill.
     *
     * @param string $bill
     * @return \AppBundle\Entity\User
     */
    public function setBill($bill)
    {
        $this->bill = $bill;

        return $this;
    }

    /**
     * Get the value of bill.
     *
     * @return string
     */
    public function getBill()
    {
        return $this->bill;
    }

    /**
     * Set the value of isAssociated.
     *
     * @param string $isAssociated
     * @return \AppBundle\Entity\User
     */
    public function setIsAssociated($isAssociated)
    {
        $this->isAssociated = $isAssociated;

        return $this;
    }

    /**
     * Get the value of isAssociated.
     *
     * @return string
     */
    public function getIsAssociated()
    {
        return $this->isAssociated;
    }

    /**
     * Set the value of acceptedTerms.
     *
     * @param string $acceptedTerms
     * @return \AppBundle\Entity\User
     */
    public function setAcceptedTerms($acceptedTerms)
    {
        $this->acceptedTerms = $acceptedTerms;

        return $this;
    }

    /**
     * Get the value of acceptedTerms.
     *
     * @return string
     */
    public function getAcceptedTerms()
    {
        return $this->acceptedTerms;
    }

    /**
     * Set the value of score.
     *
     * @param string $score
     * @return \AppBundle\Entity\User
     */
    public function setScore($score)
    {
        $this->score = $score;

        return $this;
    }

    /**
     * Get the value of score.
     *
     * @return string
     */
    public function getScore()
    {
        return $this->score;
    }
}
