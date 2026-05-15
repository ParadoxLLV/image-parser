import CustomLink from '../../components/CustomLink';

const About = () => {
  return (
    <div className="w-full dark:bg-accent-dark bg-accent rounded-md p-2">
      <span>
        This site serves the purpose of converting image formats to other
        formats. To do so, the user must have a positive number of credits. Each
        logged in free user gets 15 credits each month and a 10 file max
        conversion limit per one conversion. Guest users gets 10 monthly credits
        and a 5 file max conversion limit per one conversion. We also have
        different subscriptions and one-time purchases available over in the
        <CustomLink
          to="pricing"
          variant="green"
          className="dark:text-teal-900 dark:hover:text-teal-700 text-teal-900 hover:text-teal-700"
          target="_blank"
        >
          Pricing
        </CustomLink>
        section.
      </span>
    </div>
  );
};

export default About;
