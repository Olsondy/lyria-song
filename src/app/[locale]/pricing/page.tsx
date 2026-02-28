const plans = [
  {
    name: "Free",
    price: "$0",
    generations: "20 / month",
    stems: "No",
    projectVault: "Basic",
  },
  {
    name: "Pro",
    price: "$29",
    generations: "400 / month",
    stems: "Yes",
    projectVault: "Advanced",
  },
  {
    name: "Studio",
    price: "$99",
    generations: "2000 / month",
    stems: "Priority + Batch",
    projectVault: "Team Workspace",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="panel hero">
        <p className="kicker">/pricing</p>
        <h1 className="title">Commercial Conversion Layer</h1>
        <p className="subtitle">
          MVP pricing matrix for Free, Pro, and Studio plans. Payment workflow
          is planned for the next iteration.
        </p>
      </section>

      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Generations</th>
              <th>Stems Export</th>
              <th>My Songs Vault</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.name}>
                <td>{plan.name}</td>
                <td className="mono">{plan.price}</td>
                <td>{plan.generations}</td>
                <td>{plan.stems}</td>
                <td>{plan.projectVault}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
