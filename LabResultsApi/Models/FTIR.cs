namespace LabResultsApi.Models;

public class FTIR
{
    public int SampleId { get; set; }
    public double? AntiOxidant { get; set; }
    public double? Oxidation { get; set; }
    public double? H2O { get; set; }
    public double? Zddp { get; set; }
    public double? Soot { get; set; }
    public double? FuelDilution { get; set; }
    public double? Mixture { get; set; }
    public double? NLGI { get; set; }
    public double? Contam { get; set; }
}
