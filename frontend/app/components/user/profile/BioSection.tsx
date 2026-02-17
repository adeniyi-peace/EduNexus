interface Props {
    value: string;
    onChange: (val: string) => void;
}

export const BioSection = ({ value, onChange }: Props) => {
    const MAX_CHARS = 500;

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-bold">About You</span>
                <span className={`label-text-alt ${value.length > MAX_CHARS ? 'text-error' : ''}`}>
                    {value.length}/{MAX_CHARS}
                </span>
            </label>
            <textarea 
                className={`textarea textarea-bordered h-32 w-full ${value.length > MAX_CHARS ? 'textarea-error' : ''}`}
                placeholder="Tell us about your teaching style or learning goals..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            ></textarea>
            <label className="label">
                <span className="label-text-alt opacity-50">
                    This will be displayed on your public profile.
                </span>
            </label>
        </div>
    );
};